export const STORY_TITLE='The Chronicles of Bed Wars: Rise of the Yellow Emperor';
export const STORY_DIFFICULTIES={Story:{bot:'Easy',extraHealth:10,description:'Extra golden hearts. A forgiving journey.'},Normal:{bot:'Normal',extraHealth:0,description:'The intended adventure.'},Emperor:{bot:'Hard',extraHealth:0,description:'The strongest opposition.'}};
export const STORY_CHAPTERS=[
 {id:'prologue',number:'PROLOGUE',name:'The Yellow Emperor',available:true},
 {id:'chapter1',number:'CHAPTER I',name:'For the team...',available:true},
 {id:'chapter2',number:'CHAPTER II',name:'The Dragon of Doom'},
 {id:'chapter3',number:'CHAPTER III',name:"Larp108’s Revenge"},
 {id:'chapter4',number:'CHAPTER IV',name:'The Pearl That Defied Death'},
 {id:'chapter5',number:'CHAPTER V',name:'The Final Reckoning'},
 {id:'epilogue',number:'EPILOGUE',name:'The Final Legacy'}
];
export const storyTime=seconds=>`${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
export const STORY_ROSTER=[{id:'emperor',name:'EPHIRISI',human:true,isEphirisi:true,team:3,slot:0},{id:'akd',name:'AKD23',human:false,team:0,slot:0},{id:'larp',name:'LARP108',human:false,team:0,slot:1}];