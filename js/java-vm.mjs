/* CS3 Queues: limited Java interpreter. No eval(), Function(), remote services or dynamic execution.
   Intentionally implements the language features documented in SUPPORTED_JAVA.md. */
const KW_MOD = new Set(['public','private','protected','static','final','abstract']);
function tokenize(src){
  const tokens=[]; let i=0;
  while(i<src.length){
    if(/\s/.test(src[i])){i++;continue;}
    if(src.startsWith('//',i)){while(i<src.length&&src[i]!=='\n') i++;continue;}
    if(src.startsWith('/*',i)){let e=src.indexOf('*/',i+2);if(e<0)throw Error('Unclosed block comment');i=e+2;continue;}
    const tail=src.slice(i); let m;
    if((m=/^"(?:\\.|[^"\\])*"/.exec(tail))){let raw=m[0];let val;try{val=JSON.parse(raw);}catch{throw Error('Invalid string literal');}tokens.push({v:'STRING',literal:val,pos:i});i+=raw.length;continue;}
    if((m=/^(?:\d+\.\d+|\d+)/.exec(tail))){tokens.push({v:'NUMBER',literal:Number(m[0]),pos:i});i+=m[0].length;continue;}
    if((m=/^[a-zA-Z_$][a-zA-Z0-9_$]*/.exec(tail))){tokens.push({v:m[0],pos:i});i+=m[0].length;continue;}
    if((m=/^(==|!=|<=|>=|&&|\|\||\+\+|--|\+=|-=|\*=|\/=)/.exec(tail))){tokens.push({v:m[0],pos:i});i+=m[0].length;continue;}
    if('(){}[];,.<>:+-*/%!=?:'.includes(src[i])){tokens.push({v:src[i],pos:i});i++;continue;}
    throw Error('Unsupported character '+JSON.stringify(src[i])+' near position '+i);
  }
  tokens.push({v:'EOF',pos:src.length});return tokens;
}
class Parser{
  constructor(src){this.t=tokenize(src);this.i=0;this.loopDepth=0;}
  peek(n=0){return this.t[this.i+n]?.v??'EOF';}
  eat(v){if(this.peek()!==v)throw Error('Expected '+v+' but found '+this.peek()+' at position '+this.t[this.i].pos);this.i++;}
  next(){return this.t[this.i++];}
  id(){const tok=this.next();if(!/^[a-zA-Z_$][\w$]*$/.test(tok.v)||tok.v==='EOF')throw Error('Expected identifier near position '+tok.pos);return tok.v;}
  mods(){let a=[];while(KW_MOD.has(this.peek()))a.push(this.next().v);return a;}
  type(){let name=this.id();if(this.peek()==='<'){this.eat('<');let types=[];if(this.peek()!=='>'){do{types.push(this.type());if(this.peek()!==',')break;this.eat(',');}while(true);}this.eat('>');name+='<'+types.join(',')+'>';}
    while(this.peek()==='['){this.eat('[');this.eat(']');name+='[]';}return name;}
  program(){let classes={};while(this.peek()!=='EOF'){
      if(this.peek()==='import'||this.peek()==='package'){while(this.peek()!==';'&&this.peek()!=='EOF')this.next();this.eat(';');continue;}
      let m=this.mods();this.eat('class');let name=this.id();this.eat('{');let methods=[],fields=[];
      while(this.peek()!=='}'&&this.peek()!=='EOF'){
        let mm=this.mods();let first=this.type();let memberName,retType;
        if(first===name&&this.peek()==='('){memberName=first;retType=null;}
        else{retType=first;memberName=this.id();}
        if(this.peek()==='('){this.eat('(');let params=[];if(this.peek()!==')'){do{let type=this.type();let pname=this.id();params.push({type,name:pname});if(this.peek()!==',')break;this.eat(',');}while(true);}this.eat(')');let body=this.block();methods.push({name:memberName,retType,params,body,static:mm.includes('static'),constructor:retType===null});}
        else{let init=null;if(this.peek()==='='){this.eat('=');init=this.expr();}this.eat(';');fields.push({type:retType,name:memberName,init});}
      }
      this.eat('}');classes[name]={name,methods,fields};
    }return {classes};}
  block(){this.eat('{');let statements=[];while(this.peek()!=='}'&&this.peek()!=='EOF')statements.push(this.stmt());this.eat('}');return {kind:'block',statements};}
  stmt(){if(this.peek()==='{')return this.block();if(this.peek()===';'){this.eat(';');return {kind:'nop'};}
    if(this.peek()==='if'){this.eat('if');this.eat('(');let cond=this.expr();this.eat(')');let yes=this.stmt();let no=null;if(this.peek()==='else'){this.eat('else');no=this.stmt();}return {kind:'if',cond,yes,no};}
    if(this.peek()==='while'){this.eat('while');this.eat('(');let cond=this.expr();this.eat(')');this.loopDepth++;let body;try{body=this.stmt();}finally{this.loopDepth--;}return {kind:'while',cond,body};}
    if(this.peek()==='for'){
      this.eat('for');this.eat('(');let mark=this.i,foreach=null;try{const type=this.type();const name=this.id();if(this.peek()!==':')throw Error('classic');this.eat(':');const iter=this.expr();this.eat(')');foreach={type,name,iter};}catch{this.i=mark;}
      if(foreach){this.loopDepth++;let body;try{body=this.stmt();}finally{this.loopDepth--;}return {kind:'foreach',...foreach,body};}
      let init=null;if(this.peek()!==';')init=this.forPart();this.eat(';');let cond=this.peek()!==';'?this.expr():null;this.eat(';');let incr=this.peek()!==')'?this.expr():null;this.eat(')');this.loopDepth++;let body;try{body=this.stmt();}finally{this.loopDepth--;}return {kind:'for',init,cond,incr,body};
    }
    if(this.peek()==='return'){this.eat('return');let x=this.peek()!==';'?this.expr():null;this.eat(';');return {kind:'return',expr:x};}
    if(this.peek()==='break'||this.peek()==='continue'){const kind=this.next().v;if(!this.loopDepth)throw Error(kind+' is only valid inside a loop');this.eat(';');return {kind};}
    let result=this.forPart();this.eat(';');return result;
  }
  forPart(){let mark=this.i;try{let type=this.type(),name=this.id();if(!['=',';',')',','].includes(this.peek()))throw Error('expression');let init=null;if(this.peek()==='='){this.eat('=');init=this.expr();}return {kind:'declare',type,name,init};}catch{this.i=mark;return {kind:'expr',expr:this.expr()};}}
  expr(min=0){let left=this.prefix();const precedence={'=':1,'+=':1,'-=':1,'||':2,'&&':3,'==':4,'!=':4,'<':5,'>':5,'<=':5,'>=':5,'+':6,'-':6,'*':7,'/':7,'%':7};
    while(true){let op=this.peek(),p=precedence[op]??0;if(p<min||p===0)break;this.next();let right=this.expr(p+(p===1?0:1));left={kind:'binary',op,left,right};}return left;}
  prefix(){let t=this.next();let node;
    if(t.v==='NUMBER'||t.v==='STRING')node={kind:'literal',value:t.literal};
    else if(t.v==='true'||t.v==='false'||t.v==='null')node={kind:'literal',value:t.v==='null'?null:t.v==='true'};
    else if(['!','-','+','++','--'].includes(t.v))node={kind:'unary',op:t.v,arg:this.expr(8)};
    else if(t.v==='('){node=this.expr();this.eat(')');}
    else if(t.v==='new'){
      const typ=this.type();this.eat('(');let args=this.args();this.eat(')');node={kind:'new',type:typ,args};
    }else if(/^[a-zA-Z_$][\w$]*$/.test(t.v))node={kind:'ident',name:t.v};
    else throw Error('Unexpected '+t.v+' at position '+t.pos);
    while(true){if(this.peek()==='.'){this.eat('.');node={kind:'get',obj:node,prop:this.id()};}
      else if(this.peek()==='('){this.eat('(');node={kind:'call',fn:node,args:this.args()};this.eat(')');}
      else if(this.peek()==='['){this.eat('[');let index=this.expr();this.eat(']');node={kind:'index',obj:node,index};}
      else if(this.peek()==='++'||this.peek()==='--'){node={kind:'post',op:this.next().v,arg:node};}
      else break;
    }
    return node;
  }
  args(){let a=[];if(this.peek()!==')'){do{a.push(this.expr());if(this.peek()!==',')break;this.eat(',');}while(true);}return a;}
}
export function compileJava(src){const ast=new Parser(src).program();if(Object.keys(ast.classes).length!==1)throw Error('Submit exactly one public class.');return ast;}
export function fifo(items=[]){return {__kind:'Queue',items:items.slice()};}
export function priority(items=[]){const p={__kind:'PriorityQueue',items:[]};items.forEach(x=>heapAdd(p.items,x));return p;}
function compare(a,b){if(a===b)return 0;return a<b?-1:1;}
function heapAdd(h,v){h.push(v);let i=h.length-1;while(i>0){let p=(i-1)>>1;if(compare(h[p],h[i])<=0)break;[h[p],h[i]]=[h[i],h[p]];i=p;}}
function heapRemove(h){if(!h.length)throw Error('NoSuchElementException: queue is empty');let v=h[0],last=h.pop();if(h.length){h[0]=last;let i=0;while(true){let l=2*i+1,r=l+1,k=i;if(l<h.length&&compare(h[l],h[k])<0)k=l;if(r<h.length&&compare(h[r],h[k])<0)k=r;if(k===i)break;[h[i],h[k]]=[h[k],h[i]];i=k;}}return v;}
function tostring(v){if(v===null||v===undefined)return 'null';if(v&&v.__kind)return '['+v.items.map(tostring).join(', ')+']';if(Array.isArray(v))return '['+v.map(tostring).join(', ')+']';if(v&&v.__class)return v.__class+'@object';return String(v);}
class Scope{constructor(parent=null){this.parent=parent;this.values=Object.create(null);} has(n){return Object.hasOwn(this.values,n)||!!(this.parent&&this.parent.has(n));} get(n){if(Object.hasOwn(this.values,n))return this.values[n];if(this.parent)return this.parent.get(n);throw Error('Unknown variable '+n);} set(n,v){if(Object.hasOwn(this.values,n))this.values[n]=v;else if(this.parent&&this.parent.has(n))this.parent.set(n,v);else throw Error('Unknown variable '+n);} def(n,v){this.values[n]=v;}}
export class JavaVM{
  constructor(ast,limit=50000){this.ast=ast;this.limit=limit;this.steps=0;this.depth=0;}
  tick(){if(++this.steps>this.limit)throw Error('Execution stopped: too many steps (possible infinite loop).');}
  make(className,args=[]){const c=this.ast.classes[className];if(!c)throw Error('Unknown class '+className);const obj={__class:className,__fields:Object.create(null)};
    const scope=new Scope();scope.def('this',obj);
    for(const f of c.fields){obj.__fields[f.name]=f.init?this.eval(f.init,scope):['int','double'].includes(f.type)?0:f.type==='boolean'?false:null;}
    const cons=c.methods.find(m=>m.constructor&&m.params.length===args.length);if(cons)this.execute(cons,args,obj);
    else if(args.length)throw Error('No matching '+className+' constructor');return obj;
  }
  call(className,name,args=[],obj=null){const c=this.ast.classes[className];if(!c)throw Error('Class '+className+' not found');const method=c.methods.find(m=>!m.constructor&&m.name===name&&m.params.length===args.length);if(!method)throw Error('Method '+name+'('+args.length+' arguments) not found');if(!obj&&!method.static)throw Error('Method '+name+' must be static to call without an object');return this.execute(method,args,obj);}
  execute(method,args,obj){if(++this.depth>60)throw Error('Maximum recursion depth exceeded');let s=new Scope();s.def('this',obj);s.def('Integer',{__kind:'IntegerClass',MIN_VALUE:-2147483648,MAX_VALUE:2147483647});for(let i=0;i<method.params.length;i++)s.def(method.params[i].name,args[i]);
    try{const r=this.exec(method.body,s);return r?.returned?r.value:undefined;}finally{this.depth--;}
  }
  exec(node,s){this.tick();switch(node.kind){
    case 'nop':return null;
    case 'block':{let inner=new Scope(s);for(const st of node.statements){let r=this.exec(st,inner);if(r?.returned||r?.control)return r;}return null;}
    case 'declare':s.def(node.name,node.init?this.eval(node.init,s):['int','double'].includes(node.type)?0:node.type==='boolean'?false:null);return null;
    case 'expr':this.eval(node.expr,s);return null;
    case 'return':return {returned:true,value:node.expr?this.eval(node.expr,s):undefined};
    case 'break':case 'continue':return {control:node.kind};
    case 'if':return this.exec(this.eval(node.cond,s)?node.yes:(node.no??{kind:'nop'}),s);
    case 'while':{while(this.eval(node.cond,s)){this.tick();let r=this.exec(node.body,s);if(r?.returned)return r;if(r?.control==='break')break;if(r?.control==='continue')continue;}return null;}
    case 'foreach':{const arr=this.eval(node.iter,s);let items=Array.isArray(arr)?arr.slice():arr?.items?.slice();if(!items)throw Error('Enhanced for loop requires an array or collection');for(const item of items){this.tick();let inner=new Scope(s);inner.def(node.name,item);let r=this.exec(node.body,inner);if(r?.returned)return r;if(r?.control==='break')break;if(r?.control==='continue')continue;}return null;}
    case 'for':{let inner=new Scope(s);if(node.init)this.exec(node.init,inner);while(node.cond?this.eval(node.cond,inner):true){this.tick();let r=this.exec(node.body,inner);if(r?.returned)return r;if(r?.control==='break')break;if(node.incr)this.eval(node.incr,inner);if(r?.control==='continue')continue;}return null;}
    default:throw Error('Unsupported statement '+node.kind);
  }}
  get(node,s){if(node.kind==='ident'){if(node.name==='this')return s.get('this');if(node.name==='Integer')return s.get('Integer');try{return s.get(node.name);}catch(e){let obj=s.get('this');if(obj&&Object.hasOwn(obj.__fields,node.name))return obj.__fields[node.name];throw e;}}
    if(node.kind==='get'){let obj=this.eval(node.obj,s);if(obj?.__class&&Object.hasOwn(obj.__fields,node.prop))return obj.__fields[node.prop];if(obj?.__kind==='IntegerClass'&&Object.hasOwn(obj,node.prop))return obj[node.prop];if(node.prop==='length'&&(Array.isArray(obj)||typeof obj==='string'))return obj.length;throw Error('Unknown field '+node.prop);}
    if(node.kind==='index'){let arr=this.eval(node.obj,s),idx=this.eval(node.index,s);if(!Array.isArray(arr))throw Error('Indexing requires an array');if(idx<0||idx>=arr.length)throw Error('ArrayIndexOutOfBoundsException');return arr[idx];}
    throw Error('Invalid assignment target');
  }
  set(node,v,s){if(node.kind==='ident'){try{s.set(node.name,v);}catch(e){let obj=s.get('this');if(obj&&Object.hasOwn(obj.__fields,node.name))obj.__fields[node.name]=v;else throw e;}return v;}
    if(node.kind==='get'){let obj=this.eval(node.obj,s);if(obj?.__class&&Object.hasOwn(obj.__fields,node.prop)){obj.__fields[node.prop]=v;return v;}throw Error('Unknown field '+node.prop);}
    if(node.kind==='index'){let arr=this.eval(node.obj,s),idx=this.eval(node.index,s);if(!Array.isArray(arr)||idx<0||idx>=arr.length)throw Error('ArrayIndexOutOfBoundsException');arr[idx]=v;return v;}
    throw Error('Invalid assignment');}
  eval(n,s){this.tick();switch(n.kind){
    case 'literal':return n.value;
    case 'ident':case 'get':case 'index':return this.get(n,s);
    case 'new':{let args=n.args.map(a=>this.eval(a,s));let name=n.type.replace(/<.*>/,'');if(name==='LinkedList'||name==='Queue')return fifo();if(name==='PriorityQueue')return priority();if(name==='ArrayList')return {__kind:'ArrayList',items:[]};if(name==='Stack')return {__kind:'Stack',items:[]};return this.make(name,args);}
    case 'unary':{let a=this.eval(n.arg,s);if(n.op==='!')return !a;if(n.op==='-')return -a;if(n.op==='+')return +a;if(n.op==='++'||n.op==='--')return this.set(n.arg,a+(n.op==='++'?1:-1),s);throw Error('Bad unary operator');}
    case 'post':{let a=this.eval(n.arg,s);this.set(n.arg,a+(n.op==='++'?1:-1),s);return a;}
    case 'binary':{
      if(['=','+=','-='].includes(n.op)){let v=this.eval(n.right,s);if(n.op!=='='){let old=this.get(n.left,s);v=n.op==='+='?old+v:old-v;}return this.set(n.left,v,s);}
      let a=this.eval(n.left,s);if(n.op==='&&')return Boolean(a)&&Boolean(this.eval(n.right,s));if(n.op==='||')return Boolean(a)||Boolean(this.eval(n.right,s));let b=this.eval(n.right,s);
      switch(n.op){case '+':return typeof a==='string'||typeof b==='string'?tostring(a)+tostring(b):a+b;case '-':return a-b;case '*':return a*b;case '/':if(b===0)throw Error('ArithmeticException: / by zero');return Math.trunc(a/b);case '%':if(b===0)throw Error('ArithmeticException: / by zero');return a%b;case '==':return a===b;case '!=':return a!==b;case '<':return a<b;case '>':return a>b;case '<=':return a<=b;case '>=':return a>=b;default:throw Error('Unknown operator '+n.op);}}
    case 'call':{
      if(!['get','ident'].includes(n.fn.kind))throw Error('Only named method calls are supported');const obj=n.fn.kind==='ident'?s.get('this'):this.eval(n.fn.obj,s),name=n.fn.kind==='ident'?n.fn.name:n.fn.prop,args=n.args.map(a=>this.eval(a,s));
      if(obj?.__class)return this.call(obj.__class,name,args,obj);
      if(obj?.__kind){let items=obj.items;
        switch(name){
          case 'add':if(obj.__kind==='PriorityQueue')heapAdd(items,args[0]);else items.push(args[0]);return true;
          case 'push':if(obj.__kind!=='Stack')throw Error('push only applies to a Stack');items.push(args[0]);return args[0];
          case 'pop':if(obj.__kind!=='Stack')throw Error('pop only applies to a Stack');if(!items.length)throw Error('EmptyStackException');return items.pop();
          case 'remove':if(!items.length)throw Error('NoSuchElementException: collection is empty');if(obj.__kind==='PriorityQueue')return heapRemove(items);if(obj.__kind==='ArrayList'){let idx=args[0]??0;if(!Number.isInteger(idx)||idx<0||idx>=items.length)throw Error('IndexOutOfBoundsException');return items.splice(idx,1)[0];}return items.shift();
          case 'poll':return items.length?obj.__kind==='PriorityQueue'?heapRemove(items):items.shift():null;
          case 'peek':return items.length?(obj.__kind==='Stack'?items[items.length-1]:items[0]):null;
          case 'isEmpty':return items.length===0;
          case 'size':return items.length;
          case 'get':if(obj.__kind!=='ArrayList')throw Error('get(index) requires ArrayList');if(args[0]<0||args[0]>=items.length)throw Error('IndexOutOfBoundsException');return items[args[0]];
          case 'set':if(obj.__kind!=='ArrayList')throw Error('set(index,value) requires ArrayList');if(args[0]<0||args[0]>=items.length)throw Error('IndexOutOfBoundsException');{let old=items[args[0]];items[args[0]]=args[1];return old;}
          case 'contains':return items.includes(args[0]);
          case 'toString':return tostring(obj);
          case 'clear':items.length=0;return undefined;
          default:throw Error('Unsupported collection method '+name);
        }
      }
      if(typeof obj==='string')switch(name){case 'equals':return obj===args[0];case 'split':return obj.split(args[0]===' '? ' ':args[0]);case 'trim':case 'strip':return obj.trim();case 'isEmpty':return obj.length===0;case 'length':return obj.length;case 'substring':return args.length===1?obj.slice(args[0]):obj.slice(args[0],args[1]);case 'charAt':return obj.charAt(args[0]);case 'toString':return obj;default:throw Error('Unsupported String method '+name);}
      if(Array.isArray(obj)){if(name==='clone')return obj.slice();throw Error('Unsupported array method '+name);}
      if(obj?.__kind==='IntegerClass')throw Error('Unsupported Integer method '+name);
      throw Error('Cannot call '+name+' on '+tostring(obj));
    }
    default:throw Error('Unsupported expression '+n.kind);
  }}
}
export function runStatic(source,klass,name,args){const ast=compileJava(source),vm=new JavaVM(ast);return {value:vm.call(klass,name,args),vm};}
