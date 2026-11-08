import { B } from '@/game/blocks';
export function safeChapterSpawn(body,x,z){for(let radius=0;radius<=8;radius++)for(let dx=-radius;dx<=radius;dx++)for(let dz=-radius;dz<=radius;dz++){if(Math.abs(dx)+Math.abs(dz)!==radius)continue;const sx=x+dx,sz=z+dz;if(body.support(sx,17.001,sz)&&!body.collides(sx,17.001,sz)){body.spawn(sx,17.001,sz);return true;}}return false;}
export const CHAPTER_ONE_BALANCE={
 Story:{guardianHealth:48,guardianDamage:4,guardianCooldown:95,akdHealth:24,sword:33,armour:7,rage:1.18},
 Normal:{guardianHealth:80,guardianDamage:6,guardianCooldown:75,akdHealth:32,sword:34,armour:9,rage:1.28},
 Emperor:{guardianHealth:100,guardianDamage:8,guardianCooldown:60,akdHealth:44,sword:34,armour:11,rage:1.4}
};
export function clearChapterBoss(c){
 const e=c.d.e;for(const companion of e.match.companions.entries.values())e.match.companions.remove(companion);
 for(const {material,opacity,transparent,depthWrite} of c.materials){Object.assign(material,{opacity,transparent,depthWrite});material.needsUpdate=true;}
 c.ending=false;c.faded=false;c.fade=0;c.guardian=null;c.bedProgress=0;c.stunnedUntil=0;c.lastGuardianAttack=0;c.stuck=0;c.stuckX=999;c.stuckZ=999;c.recoveryAt=0;c.previousHealth=undefined;
}
export function giveChapterLoadout(d){
 const s=d.e.match.players[0];s.inventory.ids.fill(0);s.inventory.counts.fill(0);s.inventory.add(34,1);s.inventory.add(77,3);s.inventory.add(B.YELLOW,64);s.inventory.add(40,80);s.inventory.add(41,24);s.sword=s.heldTool=34;s.gear.armourTier=3;s.armour=11;s.health=20;s.effects.clear();
 if(d.difficulty==='Story'){s.effects.absorption=10;s.effects.absorptionTicks=2147483647;}
 s.body.spawn(.5,17.001,38.5);s.body.yaw=0;s.body.pitch=-.12;s.spawnGuard=120;s.hurtTicks=s.hitFlash=0;d.lastHealth=s.health;d.lastAbsorption=s.effects.absorption;d.e.interaction.slot=0;
}
export function restoreChapterBattle(c,state={}){
 clearChapterBoss(c);const d=c.d,m=d.e.match,a=m.players[1],balance=c.balance;c.phase=state.phase==='rage'?'rage':'guardian';c.age=0;c.nextBedAttempt=m.clock+300;c.lastProgress=d.elapsed;
 Object.assign(a,{alive:true,final:false,health:balance.akdHealth,armour:balance.armour,sword:balance.sword,heldTool:balance.sword,spawnGuard:c.phase==='guardian'?2147483647:0,hurtTicks:0,hitFlash:0,hitAge:0,regen:0,respawnTicks:0});a.body.spawn(3.5,17.001,29.5);a.body.pitch=-.1;a.effects.clear();a.body.autoRespawn=false;a.bot.input=a.control;a.bot.attackAt=m.clock+60;
 if(c.phase==='guardian')spawnChapterGuardian(c);d.stage='gameplay';d.scenes=null;d.objectiveAge=0;d.hint='';d.objective=c.phase==='guardian'?'Defeat AKD23 and his Dream Defender':'Defeat the enraged AKD23';
}
export function spawnChapterGuardian(c,health=c.balance.guardianHealth){
 const m=c.d.e.match;c.guardian=m.companions.add({id:++m.companions.sequence,kind:95,team:0,owner:m.players[1].id,health,x:-3.5,y:17.001,z:29.5,yaw:Math.PI,anchorX:0,anchorZ:34,due:Number.MAX_SAFE_INTEGER});
 c.guardian.def={...c.guardian.def,health:c.balance.guardianHealth,damage:c.balance.guardianDamage,cooldown:c.balance.guardianCooldown,leash:16};
}