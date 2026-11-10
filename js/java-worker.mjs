import {testCode} from './exercises.mjs';
self.onmessage=(event)=>{
 const {requestId,exerciseId,source}=event.data;
 try{self.postMessage({requestId,result:testCode(exerciseId,source)});}
 catch(err){self.postMessage({requestId,result:{passed:false,compileError:'Interpreter: '+err.message,tests:[]}});}
};
