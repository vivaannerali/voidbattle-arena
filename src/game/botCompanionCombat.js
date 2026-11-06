import { damageFor } from '@/game/equipment';
export default function botCompanionCombat(bot){
 const m=bot.match,s=bot.player,p=s.body;let chosen=null,best=3.5;
 for(const c of m.companions.entries.values()){
  const b=c.body,distance=Math.hypot(b.x-p.x,b.z-p.z);if(m.allied(s.team,c.team)||distance>=best||Math.abs(b.y-p.y)>2.5||!m.lineClear(p.x,p.y+1.4,p.z,b.x,b.y+b.height*.5,b.z))continue;chosen=c;best=distance;
 }
 if(!chosen)return false;const b=chosen.body,dx=b.x-p.x,dz=b.z-p.z,wanted=Math.atan2(-dx,-dz),delta=Math.atan2(Math.sin(wanted-p.yaw),Math.cos(wanted-p.yaw));p.yaw+=Math.max(-bot.difficulty.turn,Math.min(bot.difficulty.turn,delta));p.pitch=Math.atan2(b.y+b.height*.5-p.y-p.eyeHeight,best);bot.input.forward=best>1.2;bot.input.sprint=best>2;bot.guardEdges();
 if(best<bot.difficulty.reach&&Math.abs(delta)<.35&&m.clock>=bot.attackAt){bot.attackAt=m.clock+bot.difficulty.attack;s.swingTicks=12;m.companions.hurt(chosen.id,bot.index,damageFor(s.sword));}return true;
}