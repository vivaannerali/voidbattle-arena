const KEY='bwclone.yellow-emperor.story.v1';
let memory={version:1,unlocked:['prologue'],records:{},achievements:[],checkpoint:null};
export function readStoryProgress(){try{const data=JSON.parse(localStorage.getItem(KEY)||'null');if(data?.version===1&&Array.isArray(data.unlocked)&&data.records&&Array.isArray(data.achievements))memory=data;}catch{/* Device storage may be unavailable; this session still works. */}return memory;}
export function saveStoryProgress(patch){memory={...readStoryProgress(),...patch,version:1};try{localStorage.setItem(KEY,JSON.stringify(memory));return true;}catch{return false;}}
export function completeStoryChapter(id,difficulty,seconds,deaths,damage){
 const progress=readStoryProgress(),key=id+':'+difficulty,previous=progress.records[key],stars=damage===0&&deaths===0?3:deaths===0?2:1;
 const achievements=[...new Set([...progress.achievements,...(damage===0&&deaths===0?['Flawless Emperor']:[])])];
 const record={time:Math.min(previous?.time??Infinity,seconds),stars:Math.max(previous?.stars||0,stars)};
 const unlocked=[...new Set([...progress.unlocked,...(id==='prologue'?['chapter1']:id==='chapter1'?['chapter2']:[])])];
 const persisted=saveStoryProgress({records:{...progress.records,[key]:record},unlocked,achievements,checkpoint:null});
 return {stars,achievements,persisted};
}