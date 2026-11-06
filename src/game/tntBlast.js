import { B,bed,isGlass } from '@/game/blocks';
import playerDamage from '@/game/playerDamage';
export function blastShielded(world,x,y,z,tx,ty,tz){const dx=tx-x,dy=ty-y,dz=tz-z,steps=Math.ceil(Math.hypot(dx,dy,dz)*4);for(let n=0;n<steps;n++){const f=n/steps,id=world.get(Math.floor(x+dx*f),Math.floor(y+dy*f),Math.floor(z+dz*f));if(isGlass(id)||id===B.OBSIDIAN)return true;}return false;}
export default function tntBlast(match,bomb,{radius=2.8,breakable=()=>true}={}){
 const {x,y,z,source}=bomb,w=match.world,edits=[];
 for(let dx=-3;dx<=3;dx++)for(let dy=-3;dy<=3;dy++)for(let dz=-3;dz<=3;dz++){
  const bx=Math.floor(x)+dx,by=Math.floor(y)+dy,bz=Math.floor(z)+dz,id=w.get(bx,by,bz);
  if(!id||bed(id)||isGlass(id)||id===B.OBSIDIAN||!breakable(id)||!w.editable(bx,by,bz)||Math.hypot(bx+.5-x,by+.5-y,bz+.5-z)>radius||blastShielded(w,x,y,z,bx+.5,by+.5,bz+.5))continue;
  edits.push([bx,by,bz]);
 }
 for(let i=0;i<match.players.length;i++){
  const s=match.players[i],p=s.body,owner=match.players[source];if(!s.alive||s.spawnGuard>0||i!==source&&owner&&match.allied(owner.team,s.team))continue;
  const dx=p.x-x,dz=p.z-z,distance=Math.hypot(dx,p.y+.9-y,dz);if(distance>4.5||blastShielded(w,x,y,z,p.x,p.y+.9,p.z))continue;
  const force=1-distance/4.5,damage=match.teamUpgrades.protection(i,(2+6*force)*(1-Math.min(20,s.armour)*.04));playerDamage(s,damage);s.hitFlash=12;s.hitAge=s.regen=0;
  if(i!==source){s.lastAttacker=source;s.attackAge=0;}const length=Math.hypot(dx,dz)||1;p.knockX+=dx/length*force*9;p.knockZ+=dz/length*force*9;p.vy=Math.max(p.vy,force*7);p.grounded=false;
  if(s.health<=0)match.die(i,source);
 }
 for(const c of match.companions?.entries.values()||[]){const p=c.body,distance=Math.hypot(p.x-x,p.y+p.height*.5-y,p.z-z);if(distance<=4.5&&!blastShielded(w,x,y,z,p.x,p.y+p.height*.5,p.z)){const force=1-distance/4.5;match.companions.hurt(c.id,source,2+6*force,force*9,bomb);}}
 for(const [bx,by,bz] of edits)w.set(bx,by,bz,0);
 match.fireworks.burst(x,y,z);
}