export default function windBurst(match,charge){
 const owner=match.players[charge.source];if(!owner)return;
 for(let index=0;index<match.players.length;index++){
  const s=match.players[index],self=index===charge.source;if(!s.alive||!self&&(match.allied(s.team,owner.team)||s.spawnGuard>0))continue;
  const p=s.body,dx=p.x-charge.x,dz=p.z-charge.z,distance=Math.hypot(dx,p.y+.3-charge.y,dz);if(distance>3.5)continue;
  const power=1-distance/3.5,length=Math.hypot(dx,dz)||1;p.knockX+=dx/length*10*power;p.knockZ+=dz/length*10*power;p.vy=Math.max(p.vy,5+11*power);p.grounded=false;p.fallDistance=p.fallDamage=0;
  if(self)s.windLanding=true;else{s.lastAttacker=charge.source;s.attackAge=0;}
 }
 match.fireworks.burst(charge.x,charge.y,charge.z);
}