import companionCombat from '@/game/companionCombat';
export default function companionAI(m,c){
 const p=c.body,def=c.def;
 if(m.clock%12===c.id%12){
  c.target=-1;let best=10;
  for(let index=0;index<m.players.length;index++){
   const s=m.players[index],b=s.body;if(!s.alive||s.spawnGuard>0||m.allied(s.team,c.team)||s.effects.invisibilityTicks>0&&!s.effects.revealTicks||Math.hypot(b.x-c.anchorX,b.z-c.anchorZ)>def.leash||Math.abs(b.y-p.y)>3)continue;
   const distance=Math.hypot(b.x-p.x,b.z-p.z);if(distance<best&&m.lineClear(p.x,p.y+p.height*.65,p.z,b.x,b.y+.5,b.z)){best=distance;c.target=index;}
  }
 }
 const target=m.players[c.target],chase=target?.alive&&!m.allied(target.team,c.team)&&Math.hypot(target.body.x-c.anchorX,target.body.z-c.anchorZ)<=def.leash;
 const tx=chase?target.body.x:c.anchorX,tz=chase?target.body.z:c.anchorZ,dx=tx-p.x,dz=tz-p.z,distance=Math.hypot(dx,dz);c.move=distance>(chase?def.reach*.75:.6);c.jump=false;
 if(c.move){p.yaw=Math.atan2(-dx,-dz);const nx=p.x+dx/(distance||1)*.55,nz=p.z+dz/(distance||1)*.55;
  if(p.grounded){const step=p.support(nx,p.y+1,nz)&&!p.collides(nx,p.y+1,nz);c.jump=p.collides(nx,p.y,nz)&&step;if(!p.support(nx,p.y,nz)&&!step)c.move=false;}
 }
 p.tick(c.control);if(p.fallDamage){c.health=Math.max(0,c.health-p.fallDamage);p.fallDamage=0;}
 if(chase&&c.health>0)companionCombat(m,c,c.target);
}