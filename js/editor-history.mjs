// Undo/redo for the student editor. setRangeText() shortcuts (Tab, Enter, and
// auto-unindent) do not reliably enter browsers' native undo stacks.
export function createEditorHistoryManager(getKey){
 const histories=new Map();
 const snapshot=t=>({value:t.value,start:t.selectionStart,end:t.selectionEnd});
 function history(t){const id=getKey(t);let v=histories.get(id);if(!v||(v.last.value!==t.value&&v.element!==t)){
   v={undo:[],redo:[],last:snapshot(t),pending:false,applying:false};histories.set(id,v);
  }v.element=t;return v;
 }
 function remember(t){const v=history(t),snap=snapshot(t);if(v.undo.at(-1)?.value!==snap.value){v.undo.push(snap);if(v.undo.length>500)v.undo.shift();}v.redo=[];v.pending=true;}
 function sync(t){const v=history(t);if(!v.applying&&!v.pending&&v.last.value!==t.value){if(v.undo.at(-1)?.value!==v.last.value)v.undo.push(v.last);v.redo=[];}v.last=snapshot(t);v.pending=false;}
 function step(t,redo=false){const v=history(t),from=redo?v.redo:v.undo,to=redo?v.undo:v.redo;if(!from.length)return false;
  const previous=from.pop();to.push(snapshot(t));v.applying=true;t.value=previous.value;t.setSelectionRange(previous.start,previous.end);t.dispatchEvent(new Event('input',{bubbles:true}));v.applying=false;v.last=snapshot(t);return true;
 }
 return {remember,sync,step};
}
