import playerDamage from '@/game/playerDamage';
export default function companionCombat(match,c,index){
 const s=match.players[index],p=c.body,def=c.def;if(!s?.alive||s.spawnGuard>0||match.allied(c.team,s.team)||match.clock<c.attackAt)return;
 const b=s.body;if(Math.hypot(b.x-p.x,b.z-p.z)>def.reach||b.y>p.y+p.height+.4||b.y+b.height<p.y||!match.lineClear(p.x,p.y+p.height*.65,p.z,b.x,b.y+Math.min(.9,b.height*.5),b.z))return;
 c.attackAt=match.clock+def.cooldown;const damage=match.teamUpgrades.protection(index,def.damage*(1-Math.min(20,s.armour)*.04));
 if(s.hurtTicks>0&&damage<=s.lastDamage)return;const applied=s.hurtTicks>0?damage-s.lastDamage:damage;
 s.lastDamage=damage;s.hurtTicks=10;s.hitFlash=12;s.hitAge=s.regen=s.attackAge=0;
 const owner=match.players.findIndex(player=>player.id===c.owner);s.lastAttacker=owner;playerDamage(s,applied);
 const dx=b.x-p.x,dz=b.z-p.z,length=Math.hypot(dx,dz)||1,force=c.kind===95?7:2.5;b.knockX+=dx/length*force;b.knockZ+=dz/length*force;b.vy=Math.max(b.vy,c.kind===95?6:2.5);b.grounded=false;
 if(s.health<=0)match.die(index,owner);
}