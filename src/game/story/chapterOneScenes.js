export default function chapterOneScenes(){return [
 {kind:'title',duration:4,title:'FOR THE TEAM...',subtitle:'CHAPTER I'},
 {kind:'shot',duration:4,path:[[4,20,21],[2,18.9,19.5],[1.8,18.7,18.8]],look:[[.5,18.1,17.5],[.5,18.1,17.5]],slowMotion:.5},
 {kind:'dialogue',lines:[{speaker:'AKD23',team:'red',text:'FOR THE TEAM...',important:true}]},
 {kind:'shot',duration:8,path:[[5,21,18],[4,20,23],[3,20,28]],look:[[.5,18,18],[.5,18,24]],slowMotion:.7,walks:[{index:1,points:[[.5,17.001,21],[.5,17.001,25.5]]}],narrator:'A warrior. A guardian. A promise made in the name of his team.'},
 {kind:'dialogue',lines:[{speaker:'NARRATOR',team:'gold',text:'Defeat the Dream Defender first. Its fall will enrage AKD23. If he starts breaking your bed, strike him to interrupt. Your bed is protected in this chapter.'},{speaker:'EPHIRISI',team:'yellow',text:'Then let them come. The Yellow Emperor does not yield.',important:true}]}
];}
export function chapterOneDefeat(x,z){return [
 {kind:'shot',duration:3,path:[[x+4,20,z+4],[x+2,18.6,z+2.5]],look:[[x,17.8,z],[x,17.8,z]],slowMotion:.35},
 {kind:'dialogue',lines:[{speaker:'AKD23',team:'red',text:'Larp... avenge me...',important:true}]},
 {kind:'shot',duration:5,path:[[x+2,19,z+3],[x+7,24,z+8]],look:[[x,17.8,z],[x,18,z]],narrator:'AKD23 had fallen. The revenge had now become personal.'}
];}