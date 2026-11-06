import playerDamage from '@/game/playerDamage';
export default function arrowDamage(match,arrow,index){
 const victim=match.players[index];if(!victim?.alive||victim.spawnGuard>0||match.phase!=='active')return;
 const damage=match.teamUpgrades.protection(index,arrow.damage*(1-Math.min(20,victim.armour)*.04));
 if(victim.hurtTicks>0&&damage<=victim.lastDamage)return;
 const applied=victim.hurtTicks>0?damage-victim.lastDamage:damage;
 victim.lastDamage=damage;victim.hurtTicks=10;victim.hitFlash=10;victim.hitAge=victim.regen=victim.attackAge=0;victim.lastAttacker=arrow.source;playerDamage(victim,applied);
 const p=victim.body,length=Math.hypot(arrow.vx,arrow.vz)||1;
 p.knockX=arrow.vx/length*arrow.punch;p.knockZ=arrow.vz/length*arrow.punch;p.vy=Math.max(p.vy,arrow.punch>=12?6:3.5);p.grounded=false;
 if(victim.health<=0)match.die(index,arrow.source);
}