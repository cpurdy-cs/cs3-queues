// Validation is intentionally repeatable. A failed attempt must never lock the
// student's Module 6 discovery or prevent a corrected answer from passing.
export function checkReductionReasoning(design,explanation){
 const fields=['first','second','total','boundary','structure'];
 if(fields.some(k=>!String(design[k]??'').trim())||!String(explanation??'').trim())return {passed:false,message:'Complete all five design questions and explain your strategy before checking.'};
 if(design.first!=='3,3')return {passed:false,message:'Reconsider which pair should be combined first. Think about the two smallest available values.'};
 if(design.second!=='6,8')return {passed:false,message:'After the first merge, reconsider the two smallest values still available.'};
 if(Number(design.total)!==49)return {passed:false,message:'Recalculate the total. Add the cost of every individual merge, including the final merge.'};
 if(design.boundary!=='0')return {passed:false,message:'An empty or one-element collection requires no merges. Check the edge-case cost.'};
 if(design.structure!=='priority')return {passed:false,message:'Which Java collection makes it efficient to repeatedly retrieve the smallest available value?'};
 const words=String(explanation).trim().split(/\s+/).filter(Boolean);
 if(words.length<18||String(explanation).trim().length<80)return {passed:false,message:'Explain your general rule and why it reduces repeated merge costs. Use at least two substantive sentences.'};
 return {passed:true,message:''};
}
