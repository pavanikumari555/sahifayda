export const postPalettes=[['#0b2234','#a4f0d2','#eef9f6','#153b4b'],['#f4f0e3','#155f4b','#193a31','#e4e8d7'],['#291f43','#efc28b','#f8f1ff','#49365c'],['#0d3031','#ffd875','#f2fff8','#1a5051']];
export function textLines(context,text,width){
 const lines=[];let line='';for(const word of text.split(/\s+/)){const joined=line?line+' '+word:word;if(context.measureText(joined).width<=width){line=joined;continue;}if(line)lines.push(line);line='';for(const char of Array.from(word)){if(context.measureText(line+char).width>width){lines.push(line);line=char;}else line+=char;}}if(line)lines.push(line);return lines;
}
export function drawPost(canvas,post,language){
 const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas unavailable');canvas.width=1080;canvas.height=1080;
 const [bg,accent,ink,soft]=postPalettes[post.palette],hi=language==='hi';ctx.fillStyle=bg;ctx.fillRect(0,0,1080,1080);
 ctx.fillStyle=soft;if(post.layout===0){ctx.beginPath();ctx.arc(1050,80,270,0,Math.PI*2);ctx.fill();}else if(post.layout===1){ctx.fillRect(0,0,28,1080);ctx.fillRect(830,760,250,320);}else{ctx.fillRect(60,195,960,9);ctx.fillRect(850,0,230,145);}
 ctx.fillStyle=accent;ctx.font='700 34px Manrope, sans-serif';ctx.fillText('SahiFayda',80,100);
 ctx.font='500 22px "Noto Sans Devanagari", sans-serif';ctx.fillText(hi?'रोज़ के पैसे। बेहतर समझ।':'EVERYDAY MONEY. MADE CLEARER.',80,149);
 let titleLines,fontSize=66;do{ctx.font=`700 ${fontSize}px "Noto Sans Devanagari", Manrope, sans-serif`;titleLines=textLines(ctx,post['title_'+language],900);if(titleLines.length<=4)break;fontSize-=4;}while(fontSize>=46);
 let y=290;ctx.fillStyle=ink;const titleHeight=fontSize*1.4;for(const line of titleLines){ctx.fillText(line,80,y);y+=titleHeight;}
 y+=28;let bodyLines,bodySize=40;do{ctx.font=`400 ${bodySize}px "Noto Sans Devanagari", sans-serif`;bodyLines=textLines(ctx,post['body_'+language],900);if(y+bodyLines.length*bodySize*1.65<910)break;bodySize-=2;}while(bodySize>=28);
 if(titleLines.length>4||y+bodyLines.length*bodySize*1.65>=940)throw Error('Copy is too long for the card. Shorten the title or body before exporting.');
 ctx.fillStyle=ink;for(const line of bodyLines){ctx.fillText(line,80,y);y+=bodySize*1.65;}
 ctx.strokeStyle=accent;ctx.globalAlpha=.4;ctx.beginPath();ctx.moveTo(80,965);ctx.lineTo(1000,965);ctx.stroke();ctx.globalAlpha=1;
 ctx.fillStyle=accent;ctx.font='500 21px "Noto Sans Devanagari", sans-serif';ctx.fillText(hi?'शैक्षिक जानकारी • लागू शर्तें जाँचें':'Educational information • Check applicable terms',80,1006);
 ctx.font='400 17px sans-serif';ctx.fillText(post.day+' · '+(post.state==='approved'?'OWNER REVIEWED':'DRAFT — REVIEW BEFORE POSTING'),80,1045);
}
