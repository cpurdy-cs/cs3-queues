// Final assessment attempt tracking. Keeps prior graded work when students retry.
const copy=o=>JSON.parse(JSON.stringify(o));
export function archiveAttempt(f){
 if(!Array.isArray(f.history))f.history=[];
 if(!f.grading||!f.attempts||f.history.some(a=>a.attempt===f.attempts))return;
 f.history.push({attempt:f.attempts,submittedAt:f.submittedAt,score:f.grading.total,mc:copy(f.mc),traces:copy(f.traces),code:copy(f.code),grading:copy(f.grading)});
}
export function beginFinalRetry(f){
 if(f.status!=='submitted')return false;
 archiveAttempt(f);f.status='retrying';return true;
}
export function recordFinalSubmission(f,grading,submittedAt=new Date().toISOString()){
 archiveAttempt(f);
 f.grading=grading;
 f.status='submitted';
 f.submittedAt=submittedAt;
 f.attempts=(Number(f.attempts)||0)+1;
 f.bestScore=Math.max(Number(f.bestScore??0),Number(grading.total)||0);
 archiveAttempt(f);
 return f;
}
