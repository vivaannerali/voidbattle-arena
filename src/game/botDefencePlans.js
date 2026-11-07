import { TEAMS } from '@/game/map';
import { B } from '@/game/blocks';
import { BED_FOOT_Z,BED_HEAD_Z } from '@/game/bedLayout';

const STYLES={
 rush:{name:'Quick wool cover',layers:['wool']},
 double:{name:'Double wool',layers:['wool','wool']},
 wood:{name:'Wood and wool',layers:['oak','wool']},
 end:{name:'End stone and wool',layers:['end_stone','wool']},
 clay:{name:'Budget clay and wool',layers:['clay','wool']},
 butterfly:{name:'Butterfly',layers:['end_stone','glass']}
};
export default function botDefencePlans(team,mode='Solos'){
 const large=mode==='Trios'||mode==='Squads',pool=large?['butterfly','butterfly','end','wood','clay']:['rush','rush','double','wood','end','clay'];
 const style=pool[Math.floor(Math.random()*pool.length)],profile=STYLES[style],t=TEAMS[team],cells=[];
 const sin=Math.round(Math.sin(t.rotation)),cos=Math.round(Math.cos(t.rotation));
 const ids={wool:t.wool,clay:t.clay,glass:t.glass,end_stone:B.END,oak:B.OAK};
 const delay=(large?15+Math.random()*15:35+Math.random()*40)*60;
 const reversed=Math.random()<.5,side=Math.random()<.5?-1:1;
 for(let layer=1;layer<=profile.layers.length;layer++){
  const shell=[];
  for(let dy=0;dy<=layer;dy++)for(let z=BED_FOOT_Z-layer;z<=BED_HEAD_Z+layer;z++)for(let x=-layer;x<=layer;x++){
   const distance=Math.abs(x)+dy+Math.max(BED_FOOT_Z-z,0,z-BED_HEAD_Z);
   if(distance!==layer)continue;
   const corner=dy===0&&Math.abs(x)===1&&(z===BED_FOOT_Z-1||z===BED_HEAD_Z+1);
   if(style==='butterfly'&&layer===2&&corner)continue;
   shell.push({x,dy,z,key:profile.layers[layer-1]});
  }
  // The butterfly's twelve-block end-stone footprint supports a glass shell.
  if(style==='butterfly'&&layer===1)for(const x of [-1,1])for(const z of [BED_FOOT_Z-1,BED_HEAD_Z+1])shell.push({x,dy:0,z,key:'end_stone'});
  shell.sort((a,b)=>a.dy-b.dy||(reversed?b.z-a.z:a.z-b.z)||side*(a.x-b.x));
  for(const c of shell)cells.push({x:t.x+c.x*cos+c.z*sin,y:17+c.dy,z:t.z-c.x*sin+c.z*cos,id:ids[c.key],key:c.key,availableAt:layer===1?0:Math.round(delay)});
 }
 return {style,name:profile.name,cells,cursor:0};
}