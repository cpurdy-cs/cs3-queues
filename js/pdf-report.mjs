// Standalone PDF text writer; no network, CDN, or third-party dependency.
// Creates an ordinary multipage PDF with readable text and code excerpts.
function clean(value){return String(value??'').replace(/[^\x20-\x7E\n]/g,c=>({'\u2014':'-', '\u2013':'-', '\u2019':"'",'\u201c':'"','\u201d':'"','\u2022':'*','\u2713':'Yes','\u2715':'No'}[c]??'?'));}
function escaped(s){return clean(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');}
function wrapText(text,max){let lines=[];for(const line of clean(text).split('\n')){if(!line){lines.push('');continue;}let remain=line;while(remain.length>max){let cut=remain.lastIndexOf(' ',max);if(cut<max/2)cut=max;lines.push(remain.slice(0,cut));remain=remain.slice(cut).trimStart();}lines.push(remain);}return lines;}
export function makeAssessmentPDF(student,final){if(final?.status!=='submitted')throw Error('Submit the assessment first.');
 const pages=[];let current=[],y=747;const pushPage=()=>{pages.push(current);current=[];y=747;};
 const line=(value,{size=10,font='F1',indent=0,leading=14}={})=>{if(y<56)pushPage();current.push(`BT /${font} ${size} Tf 1 0 0 1 ${42+indent} ${y} Tm (${escaped(value)}) Tj ET`);y-=leading;};
 const text=(value,opts={})=>{const max=opts.font==='F2'?88:99;for(const l of wrapText(value,max))line(l,opts);};
 const gap=(n=9)=>{y-=n;if(y<56)pushPage();};
 line('FLOUR BLUFF CS3 | JAVA QUEUES', {size:10,font:'F2',leading:22});
 line('FINAL ASSESSMENT REPORT',{size:18,leading:28});
 text(`Student: ${student.first} ${student.last.toUpperCase()}.     Submitted: ${new Date(final.submittedAt).toLocaleString('en-US')}`);gap();
 text(`AUTOMATED TOTAL: ${final.grading.total}/100   |  Concepts ${final.grading.mc}/24   |  Tracing ${final.grading.trace}/32   |  Java ${final.grading.code}/44`,{font:'F2'});gap();
 text('This is an automatically scored classroom report. Teacher review may adjust the score. No answer key is included.');gap(16);
 line('PART A - MULTIPLE CHOICE', {size:13,leading:19});
 for(const a of final.grading.mcItems){text(`${a.number}. ${a.prompt}`,{font:'F1'});if(a.code){for(const l of a.code.split('\n'))text(l,{font:'F2',size:8,leading:11,indent:12});}text(`Response: ${a.selected}    Points: ${a.points}/${a.max}`,{indent:12});gap(7);}
 gap(12);line('PART B - CODE TRACING',{size:13,leading:19});
 for(const t of final.grading.traceItems){text(t.title,{font:'F2'});for(const l of t.code.split('\n'))text(l,{font:'F2',size:8,leading:11,indent:12});for(const f of t.fields){text(f.prompt);text(`Response: ${f.selected||'(blank)'}    Points: ${f.points}/${f.max}`,{indent:12});}gap(12);}
 gap(12);line('PART C - JAVA PROGRAMMING',{size:13,leading:19});
 for(const id of ['f1','f2']){const c=final.grading.programs[id];text(`${id.toUpperCase()}  ${c.title}   ${c.points}/22 points`,{font:'F2'});for(const l of clean(c.source).split('\n')){for(const a of wrapText(l,82))line(a,{size:8,font:'F2',leading:11,indent:8});}gap(4);if(c.error)text(`Compiler / runtime feedback: ${c.error}`);text(`Automated tests: ${c.tests.filter(x=>x.pass).length}/${c.tests.length} passed`);for(const t of c.tests){text(`${t.pass?'PASS':'FAIL'} - ${t.name}`,{indent:10,size:9,leading:13});if(!t.pass){text(`Expected: ${t.expected}; actual: ${t.actual}`,{indent:20,size:8,leading:11});}}gap(16);}
 if(current.length)pages.push(current);
 const objects=[null];const add=obj=>(objects.push(obj),objects.length-1);const catalogId=add('');const pagesId=add('');const font1Id=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');const font2Id=add('<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>');const pageIds=[];
 pages.forEach((commands,i)=>{const footer=`BT /F1 9 Tf 1 0 0 1 42 30 Tm (${escaped(`CS3 Java Queues  |  ${student.first} ${student.last}.  |  Page ${i+1} of ${pages.length}`)}) Tj ET`;const stream=commands.join('\n')+'\n'+footer+'\n';const streamLength=new TextEncoder().encode(stream).length;const contentId=add(`<< /Length ${streamLength} >>\nstream\n${stream}endstream`);pageIds.push(add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${font1Id} 0 R /F2 ${font2Id} 0 R >> >> /Contents ${contentId} 0 R >>`));});
 objects[pagesId]=`<< /Type /Pages /Kids [${pageIds.map(x=>x+' 0 R').join(' ')}] /Count ${pageIds.length} >>`;
 objects[catalogId]=`<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
 let doc='%PDF-1.4\n',offsets=[0];for(let i=1;i<objects.length;i++){offsets.push(new TextEncoder().encode(doc).length);doc+=`${i} 0 obj\n${objects[i]}\nendobj\n`;}
 const xref=new TextEncoder().encode(doc).length;doc+=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;for(let i=1;i<objects.length;i++)doc+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';doc+=`trailer\n<< /Size ${objects.length} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
 return new TextEncoder().encode(doc);
}
