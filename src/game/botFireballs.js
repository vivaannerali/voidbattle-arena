import { isWool } from '@/game/blocks';
export default function botFireballs(bot){
 const m=bot.match,p=bot.player.body;if(!p.grounded||!bot.player.inventory.total(75)||m.clock<(bot.player.fireballAt||0)||m.clock<(bot.fireballScanAt||0))return false;
 bot.fireballScanAt=m.clock+30;let best=null,range=43;
 for(const enemy of m.players){
  const e=enemy.body;if(!enemy.alive||m.allied(bot.player.team,enemy.team)||!e.grounded)continue;
  const distance=Math.hypot(e.x-p.x,e.y-p.y,e.z-p.z);if(distance<8||distance>=range)continue;
  const flight=distance/22,bx=Math.floor(e.x+Math.max(-2,Math.min(2,e.vx*flight))),bz=Math.floor(e.z+Math.max(-2,Math.min(2,e.vz*flight))),by=Math.floor(e.y-.1);
  const x=isWool(m.world.get(bx,by,bz))?bx:Math.floor(e.x),z=isWool(m.world.get(bx,by,bz))?bz:Math.floor(e.z);
  if(!isWool(m.world.get(x,by,z))||!m.world.editable(x,by,z))continue;
  const open=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dz])=>!m.world.get(x+dx,by,z+dz)).length;if(open<2)continue;
  const tx=x+.5,ty=by+.8,tz=z+.5;
  if(m.players.some(s=>s.alive&&m.allied(bot.player.team,s.team)&&Math.hypot(s.body.x-tx,s.body.y+.9-ty,s.body.z-tz)<5))continue;
  if(!m.lineClear(p.x,p.y+p.eyeHeight,p.z,tx,by+1.05,tz))continue;
  best={x:tx,y:ty,z:tz};range=distance;
 }
 if(!best||!m.fireballs.launch(bot.index,best.x-p.x,best.y-p.y-p.eyeHeight,best.z-p.z))return false;
 p.yaw=Math.atan2(p.x-best.x,p.z-best.z);p.pitch=Math.atan2(best.y-p.y-p.eyeHeight,Math.hypot(best.x-p.x,best.z-p.z));bot.player.heldTool=75;return true;
}