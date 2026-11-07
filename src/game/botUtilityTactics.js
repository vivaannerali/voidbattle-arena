import { gridX,gridZ } from '@/game/botGrid';
export default function botUtilityTactics(bot){
 const m=bot.match,s=bot.player,p=s.body,i=s.inventory;
 if(!p.grounded||m.clock<(s.utilityAt||0)||m.clock<(bot.throwScanAt||0))return false;
 bot.throwScanAt=m.clock+20;let id=0,tx=0,ty=0,tz=0;
 const target=m.players[bot.target];
 if(i.total(89)&&target?.alive){
  const e=target.body,distance=Math.hypot(p.x-e.x,p.z-e.z),y=Math.floor(e.y-.1),x=Math.floor(e.x),z=Math.floor(e.z);
  const edge=[[2,0],[-2,0],[0,2],[0,-2]].some(([dx,dz])=>!m.world.get(x+dx,y,z+dz));
  if(distance>6&&distance<16&&edge&&m.lineClear(p.x,p.y+p.eyeHeight,p.z,e.x,e.y+.5,e.z)&&!m.players.some(other=>other!==s&&other.alive&&m.allied(s.team,other.team)&&Math.hypot(other.body.x-e.x,other.body.z-e.z)<4)){id=89;tx=e.x;ty=e.y+.5;tz=e.z;}
 }
 if(!id&&i.total(88)&&bot.nav.cursor<bot.nav.length-6){
  const path=bot.nav.path,start=bot.nav.cursor,first=path[start],end=path[start+6];
  const x=gridX(first),z=gridZ(first),ex=gridX(end),ez=gridZ(end);
  if(bot.director.grid.height(first)===0&&(x===ex||z===ez)&&m.lineClear(p.x,p.y+p.eyeHeight,p.z,ex+.5,p.y+p.eyeHeight,ez+.5)){id=88;tx=ex+.5;ty=p.y+p.eyeHeight;tz=ez+.5;}
 }
 if(!id)return false;
 p.yaw=Math.atan2(p.x-tx,p.z-tz);p.pitch=Math.atan2(ty-p.y-p.eyeHeight,Math.hypot(tx-p.x,tz-p.z));
 const slot=i.ids.findIndex((item,index)=>item===id&&i.counts[index]>0);
 if(slot<0||!m.utilities.launch({playerIndex:bot.index,blocks:i.ids,slot,store:i}))return false;
 s.heldTool=id;s.swingTicks=12;bot.throwScanAt=m.clock+90;return true;
}