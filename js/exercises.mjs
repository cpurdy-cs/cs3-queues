import {compileJava,JavaVM,fifo,priority} from './java-vm.mjs';
export const EXERCISES=[
  {id:'e1',module:0,title:'Add and examine the front',className:'QueueSkills',method:'frontAfter',difficulty:'Guided method',instructions:'Write frontAfter so it adds next to the rear of q, then returns the value at the front. Do not remove anything. The input queue must be modified.',signature:'public static int frontAfter(Queue<Integer> q, int next)',starter:`import java.util.Queue;
public class QueueSkills {
    public static int frontAfter(Queue<Integer> q, int next) {
        // Add next, then return the front item.
        return 0;
    }
}`},
  {id:'e2',module:1,title:'Rotate a queue',className:'QueueAlgorithms',method:'moveFrontToBack',difficulty:'Complete method',instructions:'Move the front item to the rear exactly moves times, then return the new front. If the queue is empty, return Integer.MIN_VALUE. Your method must change the original queue, not replace it. Use a loop.',signature:'public static int moveFrontToBack(Queue<Integer> q, int moves)',starter:`import java.util.Queue;
public class QueueAlgorithms {
    public static int moveFrontToBack(Queue<Integer> q, int moves) {
        // Use q.remove() and q.add() to rotate.
        // An empty queue returns Integer.MIN_VALUE.
        return 0;
    }
}`},
  {id:'e3',module:2,title:'Palindrome lists',className:'PalinList',method:null,difficulty:'Class with fields and methods',instructions:'Build the PalinList class. Store each word in a Queue<String> AND a Stack<String>. The constructor calls setList. setList replaces the old data. isPalin compares front-to-back with back-to-front using remove() and pop(). Treat words as case-sensitive. Inputs have single spaces between words.',signature:'PalinList(String list); void setList(String list); boolean isPalin()',starter:`import java.util.Queue;
import java.util.LinkedList;
import java.util.Stack;
public class PalinList {
    private Queue<String> queue;
    private Stack<String> stack;

    public PalinList(String list) {
        setList(list);
    }

    public void setList(String list) {
        // Rebuild queue and stack from list.split(" ")
    }

    public boolean isPalin() {
        // Compare queue.remove() and stack.pop() using equals().
        return false;
    }
}`},
  {id:'e4',module:3,title:'Build your own IntQueue',className:'IntQueue',method:null,difficulty:'Independent class implementation',instructions:'Build an integer queue backed by an ArrayList<Integer>. FIFO means add at the rear, remove from index 0, and peek at index 0. remove() and peek() should return Integer.MIN_VALUE when empty. toString() uses the normal ArrayList representation, such as [5, 7, 9].',signature:'IntQueue(); void add(int); int remove(); int peek(); boolean isEmpty(); String toString()',starter:`import java.util.ArrayList;
public class IntQueue {
    private ArrayList<Integer> listOfInts;

    public IntQueue() {
        // Initialize storage.
    }

    public void add(int item) {
    }

    public int remove() {
        return 0;
    }

    public int peek() {
        return 0;
    }

    public boolean isEmpty() {
        return false;
    }

    public String toString() {
        return "";
    }
}`},
  {id:'e5',module:4,title:'Priority queue operations',className:'PrioritySkills',method:'drainNatural',difficulty:'Three complete methods',instructions:'Implement all THREE methods. (1) drainNatural removes all Strings in natural order and returns them separated by single spaces. (2) sumSmallest removes up to k minimum integers and returns their sum. (3) processEvents processes positive integers as arrivals and 0 as an instruction to serve the current minimum; return the served integers as a space-separated String. All methods must mutate the supplied priority queue correctly. Do not sort arrays or rely on toString() ordering.',signature:'String drainNatural(PriorityQueue<String> pq); int sumSmallest(PriorityQueue<Integer> pq, int k); String processEvents(PriorityQueue<Integer> pq, int[] events)',starter:`import java.util.PriorityQueue;
public class PrioritySkills {
    public static String drainNatural(PriorityQueue<String> pq) {
        // Remove Strings in natural order.
        return "";
    }

    public static int sumSmallest(PriorityQueue<Integer> pq, int k) {
        // Remove up to k smallest items. Return their sum.
        return 0;
    }

    public static String processEvents(PriorityQueue<Integer> pq, int[] events) {
        // Positive number = arrival; 0 = serve smallest if possible.
        // Return served values separated by one space.
        return "";
    }
}`},
  {id:'e6',module:5,title:'Minimum-cost array reduction',className:'ArrayReduction',method:'min_cost',difficulty:'Fully independent class and algorithm',instructions:'Using the strategy you developed in the discovery activity, write a complete public class named ArrayReduction with a public static int min_cost(int[] r) method. Start with a blank editor: write any imports, the class declaration, the method, and all implementation statements yourself. Use PriorityQueue<Integer> as your main data structure. Return the minimum possible total cost to combine all elements into one; arrays of length zero or one have cost 0. Your method must handle duplicate and negative numbers and must not modify the original input array.',signature:'public static int min_cost(int[] r)',starter:''},
  {id:'f1',module:6,title:'Find an item by rotating',className:'QueueFinal',method:'alignFront',difficulty:'Final assessment',instructions:'Rotate the queue to bring target to the front. Return false and restore the original queue if the target is absent.',signature:'public static boolean alignFront(Queue<Integer> q, int target)',starter:`import java.util.Queue;
public class QueueFinal {
    public static boolean alignFront(Queue<Integer> q, int target) {
        return false;
    }
}`},
  {id:'f2',module:6,title:'Serve values below a threshold',className:'PriorityFinal',method:'countBelow',difficulty:'Final assessment',instructions:'Remove all values less than threshold from a PriorityQueue<Integer> and return how many were removed.',signature:'public static int countBelow(PriorityQueue<Integer> pq, int threshold)',starter:`import java.util.PriorityQueue;
public class PriorityFinal {
    public static int countBelow(PriorityQueue<Integer> pq, int threshold) {
        return 0;
    }
}`}

];
function result(name,condition,expected,actual,detail=''){return {name,pass:!!condition,expected:String(expected),actual:String(actual),detail};}
function equal(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function expectSignature(ast,spec){const cl=ast.classes[spec.className];if(!cl)throw Error('Expected class '+spec.className+'.');
 const required={PalinList:['setList','isPalin'],PrioritySkills:['drainNatural','sumSmallest','processEvents'],IntQueue:['add','remove','peek','isEmpty','toString']}[spec.className]??[spec.method];
 const missing=required.filter(n=>!cl.methods.some(m=>m.name===n));if(missing.length)throw Error('Missing method(s): '+missing.join(', '));
 if(spec.method){const m=cl.methods.find(x=>x.name===spec.method);if(!m.static)throw Error(spec.method+' must be declared static.');}
 if(spec.id==='e3'&&!cl.methods.some(m=>m.constructor&&m.params.length===1))throw Error('Provide a PalinList(String list) constructor.');
 if(spec.id==='e4'&&!cl.methods.some(m=>m.constructor))throw Error('Provide an IntQueue() constructor.');
 if(spec.id==='e4'&&!cl.fields.some(f=>f.type.startsWith('ArrayList')))throw Error('Use an ArrayList<Integer> field for storage.');
}
function requireAlgorithms(spec,src){const cleaned=src.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g,'');
 const required={e2:[[/\.remove\s*\(/,'Use remove() to rotate the queue.'],[/\.add\s*\(/,'Use add() to put rotated values at the rear.'],[/\b(for|while)\s*\(/,'Use a loop to rotate moves times.']],e3:[[/\bStack\s*</,'Use a Stack<String>.'],[/\bQueue\s*</,'Use a Queue<String>.'],[/\.pop\s*\(/,'Compare against stack.pop().'],[/\.remove\s*\(/,'Compare against queue.remove().']],e5:[[/\.remove\s*\(/,'Use PriorityQueue.remove().'],[/\bwhile\s*\(/,'Use a while loop.'],[/\bfor\s*\(/,'Process the incoming events with a for loop.']],f1:[[/\.remove\s*\(/,'Rotate with remove().'],[/\.add\s*\(/,'Preserve items with add().'],[/\b(for|while)\s*\(/,'Use a loop.']],f2:[[/\.remove\s*\(/,'Remove low-priority values.'],[/\.peek\s*\(/,'Check the current minimum.'],[/\bwhile\s*\(/,'Use a loop.']],e6:[[/new\s+PriorityQueue\s*</,'Instantiate PriorityQueue<Integer>.'],[/\.remove\s*\(/,'Remove the two smallest values.'],[/\.add\s*\(/,'Put combined values back into the priority queue.'],[/\bwhile\s*\(/,'Repeat until one item remains.']]}[spec.id]??[];
 for(const [re,msg] of required)if(!re.test(cleaned))throw Error('Algorithm requirement: '+msg);
}
export function testCode(id,src){const spec=EXERCISES.find(e=>e.id===id);if(!spec)throw Error('Unknown exercise');let ast;
 try{ast=compileJava(src);expectSignature(ast,spec);requireAlgorithms(spec,src);}catch(err){return {passed:false,compileError:err.message,tests:[]};}
 const tests=[];const add=(name,fn)=>{try{tests.push(fn(name));}catch(err){tests.push(result(name,false,'Successful execution','Error: '+err.message,err.message));}};
 const vm=()=>new JavaVM(ast);
 if(id==='e1'){
   [[[],9],[[-3],4],[[25,14,67],99],[[0,1],-8],[[8,8,8],8]].forEach(([values,next],i)=>add('Queue '+(i+1),name=>{let q=fifo(values),m=vm(),actual=m.call(spec.className,spec.method,[q,next]),expected=values.length?values[0]:next;return result(name,actual===expected&&equal(q.items,[...values,next]),`return ${expected}; queue [${[...values,next]}]`,`return ${actual}; queue [${q.items}]`);}));
 } else if(id==='e2'){
   [[[],3],[[4,8,12,16],2],[[5,6,7],0],[[10,20],5],[[7],9],[[1,2,3,4],4],[[2,4,6],1]].forEach(([values,moves],i)=>add('Rotation '+(i+1),name=>{let q=fifo(values),m=vm(),actual=m.call(spec.className,spec.method,[q,moves]),arr=values.slice();for(let j=0;j<moves&&arr.length;j++)arr.push(arr.shift());let expected=arr.length?arr[0]:-2147483648;return result(name,actual===expected&&equal(q.items,arr),`return ${expected}; queue [${arr}]`,`return ${actual}; queue [${q.items}]`);}));
 } else if(id==='e3'){
   const cases=[['one two three two one',true],['1 2 3 4 5',false],['racecar is racecar',true],['a b c c b a',true],['chicken is a chicken',false],['a',true],['A b A',true],['a b a b',false],['',true]];
   cases.forEach(([words,expected],i)=>add('Word list '+(i+1),name=>{let m=vm(),obj=m.make('PalinList',[words]),actual=m.call('PalinList','isPalin',[],obj);return result(name,actual===expected,expected,actual,`Input: ${JSON.stringify(words)}`);}));
   add('setList replaces old list',name=>{let m=vm(),obj=m.make('PalinList',['a b a']);m.call('PalinList','setList',['a c'],obj);let actual=m.call('PalinList','isPalin',[],obj);return result(name,actual===false,false,actual);});
 } else if(id==='e4'){
   const scenarios=[['Initial empty',[],[],true],['Add three values',[['add',5],['add',7],['add',9]],[['toString','[5, 7, 9]'],['peek',5],['isEmpty',false]],true],['Remove in FIFO order',[['add',5],['add',7],['add',9]],[['remove',5],['remove',7],['remove',9],['isEmpty',true]],true],['Empty safeguards',[],[['remove',-2147483648],['peek',-2147483648],['toString','[]']],true],['Duplicates',[['add',3],['add',3],['add',8]],[['remove',3],['peek',3],['toString','[3, 8]']],true],['Negative numbers',[['add',-8],['add',0],['add',14]],[['remove',-8],['peek',0]],true],['Reuse after empty',[['add',1],['remove',1],['add',2]],[['peek',2],['remove',2],['isEmpty',true]],true],['Long sequence',Array.from({length:12},(_,i)=>['add',i-6]),[['toString','[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]']],true]];
   for(const [name,setup,checks] of scenarios)add(name,n=>{let m=vm(),obj=m.make('IntQueue'),out=[],want=[],ok=true;for(const [method,value] of setup){let a=m.call('IntQueue',method,method==='add'?[value]:[],obj);if(method==='remove')out.push(a);}for(const [method,expected] of checks){let a=m.call('IntQueue',method,[],obj);want.push(expected);out.push(a);if(a!==expected)ok=false;}return result(n,ok,JSON.stringify(want),JSON.stringify(out));});
 } else if(id==='e5'){
   [['one','two','three','four','five','six','seven'],['a','p','h','j','e','f','m','c'],['Z','a','A','b'],['x','x','a','a'],[],['pear'],['10','2','1','11']].forEach((values,i)=>add('Method 1 · Strings '+(i+1),name=>{let p=priority(values),m=vm(),actual=m.call('PrioritySkills','drainNatural',[p]),expected=values.slice().sort().join(' ');return result(name,actual===expected&&p.items.length===0,`'${expected}'; empty PQ`,`'${actual}'; ${p.items.length} items remain`);}));
   [[[9,2,5,1],2],[[5,5,5],2],[[1,2],9],[[4,7,9],0],[[],3],[[-4,0,6,2],3]].forEach(([values,k],i)=>add('Method 2 · Smallest '+(i+1),name=>{let p=priority(values),actual=vm().call('PrioritySkills','sumSmallest',[p,k]);let sorted=values.slice().sort((a,b)=>a-b),expected=sorted.slice(0,k).reduce((a,b)=>a+b,0),left=sorted.slice(k).sort((a,b)=>a-b);let remain=p.items.slice().sort((a,b)=>a-b);return result(name,actual===expected&&equal(remain,left),`sum ${expected}; remaining [${left}]`,`sum ${actual}; remaining [${remain}]`);}));
   [
    [[],[4,2,0,5,0,0], '2 4 5', []],
    [[9,1],[0,7,0,0], '1 7 9', []],
    [[],[0,0,3,0], '3', []],
    [[8,2],[6,0], '2', [6,8]],
    [[5],[3,3,0,0], '3 3', [5]]
   ].forEach(([values,events,want,remaining],i)=>add('Method 3 · Events '+(i+1),name=>{let p=priority(values),actual=vm().call('PrioritySkills','processEvents',[p,events.slice()]),remain=p.items.slice().sort((a,b)=>a-b);return result(name,actual===want&&equal(remain,remaining),`'${want}'; remaining [${remaining}]`,`'${actual}'; remaining [${remain}]`);}));
 } else if(id==='e6'){
   function reference(vals){let h=vals.slice(),total=0;while(h.length>1){h.sort((a,b)=>a-b);const a=h.shift(),b=h.shift(),sum=a+b;total+=sum;h.push(sum);}return total;}
   const cases=[[212],[25,10,20],[1,2,3],[1,2,3,4,7,22,33,54,-66,3,4,5,76,7,999],[1,1,1,1,1],[1,1],[],[2,2,2,2],[-5,-1,3,7],[6,9,1,4,3]];
   cases.forEach((values,i)=>add('Array '+(i+1),name=>{let m=vm(),copy=values.slice(),actual=m.call('ArrayReduction','min_cost',[copy]),expected=reference(values);return result(name,actual===expected&&equal(copy,values),expected,actual,`Input: [${values}]`);}));
 } else if(id==='f1'){
   [[[3,7,9],7,true,[7,9,3]],[[5,6,7],5,true,[5,6,7]],[[1,2,3],8,false,[1,2,3]],[[4,4,9],4,true,[4,4,9]],[[],3,false,[]],[[10,20,30,40],40,true,[40,10,20,30]],[[0],0,true,[0]]].forEach(([values,target,want,after],i)=>add('Rotation case '+(i+1),name=>{let q=fifo(values),got=vm().call('QueueFinal','alignFront',[q,target]);return result(name,got===want&&equal(q.items,after),`return ${want}; queue [${after}]`,`return ${got}; queue [${q.items}]`);}));
 } else if(id==='f2'){
   [[[2,8,1,7],7,2,[7,8]],[[3,3,4],3,0,[3,3,4]],[[1,2,3],10,3,[]],[[],5,0,[]],[[-3,0,7,9],1,2,[7,9]],[[5,5,5],6,3,[]],[[0,1,4],0,0,[0,1,4]]].forEach(([values,threshold,want,after],i)=>add('Threshold case '+(i+1),name=>{let p=priority(values),got=vm().call('PriorityFinal','countBelow',[p,threshold]),remain=p.items.slice().sort((a,b)=>a-b);return result(name,got===want&&equal(remain,after),`count ${want}; remaining [${after}]`,`count ${got}; remaining [${remain}]`);}));
 }
 return {passed:tests.every(t=>t.pass),compileError:null,tests,passCount:tests.filter(t=>t.pass).length,total:tests.length};
}
