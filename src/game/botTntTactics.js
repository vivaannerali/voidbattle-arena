import { basePoint } from '@/game/botConstruction';
import { BED_FOOT_Z } from '@/game/bedLayout';
import { B,bed,isGlass } from '@/game/blocks';
import { blastShielded } from '@/game/tntBlast';
export default function botTntTactics(bot){
 const m=bot.match,s=bot.player,p=s.body,team=bot.enemyTeam;
 if(bot.action!=='attack'||team<0||!m.beds[team]||!s.inventory.total(74)||m.clock<(bot.tntScanAt||0)||m.clock<(bot.utilityAt||0))return false;
 bot.tntScanAt=m.clock+60;
 const bedPoint=basePoint(team,0,BED_FOOT_Z);
 if(Math.hypot(p.x-bedPoint.x,p.z-bedPoint.z)>7)return false;
 if(bot.target>=0&&Math.hypot(m.players[bot.target].body.x-p.x,m.players[bot.target].body.z-p.z)<2.8)return false;
 for(const b of m.tnt.entries.values())if(Math.hypot(b.x-bedPoint.x,b.z-bedPoint.z)<5)return false;
 const w=m.world,candidates=[],defence=[];
 for(let bx=-2;bx<=2;bx++)for(let bz=-2;bz<=2;bz++)for(let by=17;by<=19;by++){
  const x=Math.floor(bedPoint.x)+bx,z=Math.floor(bedPoint.z)+bz,id=w.get(x,by,z);
  if(id&&!bed(id)&&!isGlass(id)&&id!==B.OBSIDIAN&&w.editable(x,by,z))defence.push({x,y:by,z});
 }
 if(defence.length<2)return false;
 for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let y=17;y<=20;y++){
  const x=Math.floor(bedPoint.x)+dx,z=Math.floor(bedPoint.z)+dz;
  if(w.get(x,y,z)||!w.get(x,y-1,z)||Math.hypot(x+.5-p.x,y+.45-p.y-p.eyeHeight,z+.5-p.z)>4.5)continue;
  if(m.players.some(other=>other!==s&&other.alive&&m.allied(s.team,other.team)&&Math.hypot(other.body.x-x-.5,other.body.y-y,other.body.z-z-.5)<4.5))continue;
  let blocks=0;
  for(const block of defence){
   if(Math.hypot(block.x-x,block.y+.5-y-.45,block.z-z)>2.8)continue;
   if(!blastShielded(w,x+.5,y+.45,z+.5,block.x+.5,block.y+.5,block.z+.5))blocks++;
  }
  if(blocks>=2)candidates.push({x,y,z,score:blocks*4-Math.hypot(p.x-x-.5,p.z-z-.5)});
 }
 candidates.sort((a,b)=>b.score-a.score);
 for(const c of candidates)if(m.tnt.prime(bot.index,c.x,c.y,c.z)){
  p.yaw=Math.atan2(p.x-c.x-.5,p.z-c.z-.5);p.pitch=Math.atan2(c.y+.45-p.y-p.eyeHeight,Math.hypot(c.x+.5-p.x,c.z+.5-p.z));
  bot.utilityAt=m.clock+240;s.heldTool=74;bot.mineProgress=0;bot.nextThink=0;return true;
 }
 return false;
}