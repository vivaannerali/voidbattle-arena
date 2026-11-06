import * as THREE from 'three';
import { damageFor,ARMOUR } from '@/game/equipment';
import { MACE } from '@/game/extraItems';
import playerDamage from '@/game/playerDamage';
import botRoster from '@/game/botRoster';
import { botSettings } from '@/game/botSettings';
import BotDirector from '@/game/botDirector';
import TntSystem from '@/game/tntSystem';
import FireballSystem from '@/game/fireballSystem';
import ArrowSystem from '@/game/arrowSystem';
import UtilityProjectiles from '@/game/utilityProjectiles';
import LocalBotChat from '@/game/localBotChat';
import { diePlayer,respawnPlayer,destroyTeamBed,finalizePlayer } from '@/game/matchLifecycle';
import TeamUpgrades from '@/game/teamUpgrades';
import voxelRaycast from '@/game/voxelRaycast';
import { alliedTeams,checkPartyVictory } from '@/game/party/partyVictory';

const IDLE={down(){return false;},sprint:false};
export const EVENT={START:1,BED:2,DEATH:3,ELIMINATED:4,END:5,RESPAWN:6,TIMELINE:7,UPGRADE:8,TRAP:9};

export default class Match {
 constructor(world,player,input,interaction,fireworks,options={}){this.world=world;this.input=input;this.interaction=interaction;this.fireworks=fireworks;this.beds=interaction.beds;this.phase='waiting';this.countdown=300;this.clock=0;this.winner=-1;this.endAt=0;this.resultReady=false;this.localOut=false;this.finishedByTime=false;this.eliminated=new Uint8Array(this.beds.length);this.events=new Int16Array(256);this.eventRead=0;this.eventWrite=0;this.aimingAtEnemy=false;this.lineHit={valid:false};this.ray=new THREE.Ray();this.box=new THREE.Box3();this.point=new THREE.Vector3();this.settings=botSettings(options);this.players=botRoster(world,player,interaction,this.settings);this.players[0].interaction=interaction;

  for(let t=0;t<this.beds.length;t++)if(!this.players.some(s=>s.team===t)){this.beds[t]=0;this.eliminated[t]=1;}
  this.teamUpgrades=new TeamUpgrades(this);this.tnt=new TntSystem(this);this.fireballs=new FireballSystem(this);this.arrows=new ArrowSystem(this);this.utilities=new UtilityProjectiles(this);this.botDirector=new BotDirector(this);this.chat=new LocalBotChat(this);
 }
 emit(type,a=0,b=0,c=0){this.chat?.event(type,a,b);const i=(this.eventWrite++%64)*4;this.events[i]=type;this.events[i+1]=a;this.events[i+2]=b;this.events[i+3]=c;if(this.eventWrite-this.eventRead>64)this.eventRead=this.eventWrite-64;}
 allied(a,b){return alliedTeams(this,a,b);}
 checkVictory(){checkPartyVictory(this);}
 begin(){if(this.settings.partyRoster)return;if(this.phase==='waiting'){this.phase='countdown';this.countdown=300;}}
 canPlay(){return this.phase==='active'&&this.players[0].alive;}
 setArmour(index){this.players[0].armour=ARMOUR[index]?.points??7;this.players[0].gear.armourTier=ARMOUR[index]?index:1;}
 spectatorTick(){const p=this.players[0].body,input=this.input;p.px=p.x;p.py=p.y;p.pz=p.z;let f=(input.down('KeyW')?1:0)-(input.down('KeyS')?1:0),s=(input.down('KeyD')?1:0)-(input.down('KeyA')?1:0);const l=Math.hypot(f,s);if(l>1){f/=l;s/=l;}p.x+=(Math.cos(p.yaw)*s-Math.sin(p.yaw)*f)/6;p.z+=(-Math.sin(p.yaw)*s-Math.cos(p.yaw)*f)/6;p.y=Math.max(-5,Math.min(65,p.y+((input.down('Space')?1:0)-(input.down('ShiftLeft')||input.down('ShiftRight')?1:0))/6));}
 tick(){this.clock++;if(this.phase==='countdown'){this.input.attackPresses=0;if(--this.countdown<=0){this.phase='active';this.emit(EVENT.START);}return;}if(this.phase==='waiting')return;
  if(this.phase==='active')this.timeline?.tick();if(this.phase==='active'){this.teamUpgrades.tick();this.botDirector.tick();this.tnt.tick();this.fireballs.tick();this.arrows.tick();this.utilities.tick();}
  if(this.phase==='finished'||!this.players[0].alive)this.spectatorTick();
  for(let i=0;i<this.players.length;i++){const s=this.players[i];if(s.hitFlash>0)s.hitFlash--;if(s.hurtTicks>0)s.hurtTicks--;if(s.spawnGuard>0)s.spawnGuard--;if(s.swingTicks>0)s.swingTicks--;s.hitAge++;s.attackAge++;
   if(!s.alive){if(this.phase==='active'&&s.respawnTicks>0&&--s.respawnTicks===0){if(this.beds[s.team])this.respawn(i);else this.finalize(i);}continue;}if(this.phase!=='active')continue;
   const p=s.body;if(s.interaction)s.heldTool=s.interaction.blocks[s.interaction.slot];p.tick(i===0?this.input:s.control||s.bot?.input||IDLE);if(p.fallDamage>0){if(s.heldTool!==MACE&&!s.windLanding){playerDamage(s,this.teamUpgrades.fallDamage(i,p.fallDamage));s.hitFlash=10;s.hitAge=s.regen=0;}p.fallDamage=0;if(s.health<=0){this.die(i,s.attackAge<600?s.lastAttacker:-1);continue;}}if(p.grounded)s.windLanding=false;if(p.y< -20){this.die(i,s.attackAge<600?s.lastAttacker:-1);continue;}if(s.hitAge>360&&s.health<20&&++s.regen>=80){s.health=Math.min(20,s.health+1);s.regen=0;}

  }
  if(this.phase==='active')this.generators?.tick();this.chat.tick();
  if(this.endAt&&this.clock>=this.endAt)this.resultReady=true;
  if(this.endAt&&this.clock%45===0){const p=this.players[0].body;this.fireworks.burst(p.x+(Math.random()-.5)*12,p.y+5+Math.random()*5,p.z-5+(Math.random()-.5)*10);}this.fireworks.tick();
 }
 lineClear(x,y,z,tx,ty,tz){const dx=tx-x,dy=ty-y,dz=tz-z,length=Math.hypot(dx,dy,dz);if(length<.001)return true;voxelRaycast(this.world,x,y,z,dx/length,dy/length,dz/length,length-.001,this.lineHit);return !this.lineHit.valid;}
 findTarget(index=0,interaction=this.interaction){const p=this.players[index].body,cp=Math.cos(p.pitch);this.ray.origin.set(p.x,p.y+p.eyeHeight,p.z);this.ray.direction.set(-Math.sin(p.yaw)*cp,Math.sin(p.pitch),-Math.cos(p.yaw)*cp);let closest=3.00001,target=-1;const block=interaction.hit;if(block.valid)closest=Math.min(closest,block.distance);for(let i=0;i<this.players.length;i++){const s=this.players[i];if(!s.alive||this.allied(s.team,this.players[index].team))continue;const b=s.body;this.box.min.set(b.x-.3,b.y,b.z-.3);this.box.max.set(b.x+.3,b.y+b.height,b.z+.3);if(this.ray.intersectBox(this.box,this.point)){const d=this.ray.origin.distanceTo(this.point);if(d<closest){closest=d;target=i;}}}return target;}
 attack(index=0,interaction=this.interaction){const input=interaction.input,target=this.findTarget(index,interaction);this.aimingAtEnemy=target>=0;while(input.attackPresses>0){input.attackPresses--;this.players[index].swingTicks=12;interaction.swingTime=.25;if(target<0)continue;const p=this.players[index].body,id=interaction.blocks[interaction.slot],critical=!p.grounded&&p.vy<-.05;this.hit(index,target,damageFor(id)*(critical?1.5:1)+(id===MACE?p.fallDistance*.25:0),critical);}}
 hit(source,target,raw,critical,weaponOverride=null){const victim=this.players[target],attacker=this.players[source];if(!victim?.alive||!attacker?.alive||this.allied(victim.team,attacker.team)||victim.spawnGuard>0||this.phase!=='active')return;attacker.spawnGuard=0;const weapon=weaponOverride??(attacker.interaction?attacker.interaction.blocks[attacker.interaction.slot]:source===0?this.interaction.blocks[this.interaction.slot]:attacker.sword),enchanted=this.teamUpgrades.swordDamage(source,raw,weapon),damage=this.teamUpgrades.protection(target,enchanted*(1-Math.min(20,victim.armour)*.04));let applied=damage;if(victim.hurtTicks>0){if(damage<=victim.lastDamage)return;applied=damage-victim.lastDamage;}victim.lastDamage=damage;victim.hurtTicks=10;playerDamage(victim,applied);victim.hitFlash=10;victim.hitAge=0;victim.regen=0;victim.lastAttacker=source;victim.attackAge=0;
  const a=attacker.body,b=victim.body,dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz)||1,strength=weapon===36?12:a.sprinting?7.4:4.4;b.knockX=dx/length*strength;b.knockZ=dz/length*strength;b.vy=Math.max(b.vy,a.sprinting?6.2:5.2);b.grounded=false;attacker.swingTicks=12;if(a.sprinting){a.vx*=.6;a.vz*=.6;if(source===0)this.input.sprint=false;else if(attacker.bot)attacker.bot.input.sprint=false;}if(critical)victim.hitFlash=14;if(victim.health<=0)this.die(target,source);
 }
 die(index,killer){diePlayer(this,index,killer);}
 respawn(index){respawnPlayer(this,index);}
 destroyBed(team,attacker=0){return destroyTeamBed(this,team,attacker);}
 finalize(index){finalizePlayer(this,index);}
 overlaps(x,y,z){for(let i=0;i<this.players.length;i++)if(this.players[i].alive&&this.players[i].body.overlaps(x,y,z))return true;return false;}
}