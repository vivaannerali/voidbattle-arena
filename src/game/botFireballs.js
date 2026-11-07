import { B,isWool } from '@/game/blocks';
import botFireballDefence from '@/game/botFireballDefence';
const vulnerable=id=>isWool(id)||id===B.OAK;
export default function botFireballs(bot){
 const m=bot.match,p=bot.player.body;if(!p.grounded||!bot.player.inventory.total(75)||m.clock<(bot.player.fireballAt||0)||m.clock<(bot.fireballScanAt||0))return false;
 bot.fireballScanAt=m.clock+30;let best=null,range=43;
 for(const enemy of m.players){
  const e=enemy.body;if(!enemy.alive||m.allied(bot.player.team,enemy.team)||enemy.effects.invisibilityTicks>0&&!enemy.effects.revealTicks)continue;
  const distance=Math.hypot(e.x-p.x,e.y-p.y,e.z-p.z);if(distance<8||distance>=range)continue;
  const flight=distance/22,bx=Math.floor(e.x+Math.max(-2,Math.min(2,e.vx*flight))),bz=Math.floor(e.z+Math.max(-2,Math.min(2,e.vz*flight))),by=Math.floor(e.y-.1);
  const x=vulnerable(m.world.get(bx,by,bz))?bx:Math.floor(e.x),z=vulnerable(m.world.get(bx,by,bz))?bz:Math.floor(e.z);
  const bridge=vulnerable(m.world.get(x,by,z))&&m.world.editable(x,by,z);
  const open=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dz])=>!m.world.get(x+dx,by,z+dz)).length;
  const cluster=m.players.filter(s=>s.alive&&!m.allied(bot.player.team,s.team)&&Math.hypot(s.body.x-e.x,s.body.z-e.z)<3).length;
  if(!(bridge&&open>=2)&&enemy.health>7&&cluster<2)continue;
  const tx=bridge?x+.5:e.x+Math.max(-1.5,Math.min(1.5,e.vx*flight)),ty=bridge?by+.8:e.y+.9,tz=bridge?z+.5:e.z+Math.max(-1.5,Math.min(1.5,e.vz*flight));
  if(m.players.some(s=>s.alive&&m.allied(bot.player.team,s.team)&&Math.hypot(s.body.x-tx,s.body.y+.9-ty,s.body.z-tz)<5))continue;
  if(!m.lineClear(p.x,p.y+p.eyeHeight,p.z,tx,bridge?by+1.05:ty,tz))continue;
  best={x:tx,y:ty,z:tz};range=distance;
 }
 best??=botFireballDefence(bot);
 if(!best||!m.fireballs.launch(bot.index,best.x-p.x,best.y-p.y-p.eyeHeight,best.z-p.z))return false;
 p.yaw=Math.atan2(p.x-best.x,p.z-best.z);p.pitch=Math.atan2(best.y-p.y-p.eyeHeight,Math.hypot(best.x-p.x,best.z-p.z));bot.player.heldTool=75;return true;
}