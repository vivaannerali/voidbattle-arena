const DAY=86400000,formatters=new Map();
function localParts(now,timeZone){
 if(!formatters.has(timeZone))formatters.set(timeZone,new Intl.DateTimeFormat('en-AU',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}));
 return Object.fromEntries(formatters.get(timeZone).formatToParts(new Date(now)).filter(part=>part.type!=='literal').map(part=>[part.type,Number(part.value)]));
}
export function localDay(now,timeZone){const p=localParts(now,timeZone);return Date.UTC(p.year,p.month-1,p.day)/DAY;}
export function localMidnight(day,timeZone){
 const wallTime=day*DAY;let instant=wallTime;
 for(let i=0;i<3;i++){const p=localParts(instant,timeZone),offset=wallTime-Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second);instant+=offset;if(!offset)break;}
 return instant;
}