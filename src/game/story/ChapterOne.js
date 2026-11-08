import StoryScenes from '@/game/story/StoryScenes';
import chapterOneScenes,{ chapterOneDefeat } from '@/game/story/chapterOneScenes';
import { CHAPTER_ONE_BALANCE,clearChapterBoss,giveChapterLoadout,restoreChapterBattle } from '@/game/story/chapterOneSetup';
import tickChapterCombat,{ recoverChapterBoss } from '@/game/story/chapterOneCombat';
export default class ChapterOne {
 constructor(d){this.d=d;this.balance=CHAPTER_ONE_BALANCE[d.difficulty];this.materials=d.e.avatars[1].materials.map(material=>({material,opacity:material.opacity,transparent:material.transparent,depthWrite:material.depthWrite}));const m=d.e.match,nativeHit=m.hit.bind(m);
  m.hit=(source,target,...args)=>{if(source===0&&target===1&&d.stage==='gameplay'){if(this.bedProgress>0)this.interrupt();if(this.phase==='guardian'){if(m.clock>=(this.shieldNoticeAt||0)){d.e.interaction.message('The Dream Defender shields AKD23. Defeat the guardian first!');this.shieldNoticeAt=m.clock+120;}return;}}return nativeHit(source,target,...args);};
 }
 opening(){clearChapterBoss(this);const d=this.d,m=d.e.match;d.actors.stop();d.stage='cinematic';d.paused=false;d.target=null;m.players[0].body.spawn(.5,17.001,38.5);m.players[0].spawnGuard=2147483647;const a=m.players[1];a.alive=true;a.health=this.balance.akdHealth;a.spawnGuard=2147483647;a.heldTool=95;a.body.spawn(.5,17.001,17.5);a.body.yaw=Math.PI;m.players[2].body.spawn(2.5,17.001,-32.5);d.scenes=new StoryScenes(d,chapterOneScenes(),()=>this.start());}
 start(resume=null){const d=this.d;d.actors.stop();if(resume?.moment&&resume.moment!=='opening')d.checkpoint.restore(resume);else{giveChapterLoadout(d);restoreChapterBattle(this);d.checkpoint.capture('guardian');}d.cacheResources();d.e.onMenu('click-resume');d.pause();}
 restore(state){restoreChapterBattle(this,state);}
 checkpoint(){return {phase:this.phase||'guardian'};}
 interrupt(){this.bedProgress=0;const clock=this.d.e.match.clock;this.stunnedUntil=clock+45;this.nextBedAttempt=clock+300;}
 tick(){tickChapterCombat(this);}
 afterTick(){const g=this.guardian,m=this.d.e.match,s=m.players[0];if(g&&g.attackAt!==this.lastGuardianAttack){this.lastGuardianAttack=g.attackAt;if(s.hitFlash===11&&s.lastAttacker===1){s.body.knockX*=1.4;s.body.knockZ*=1.4;s.body.vy=Math.max(s.body.vy,this.d.difficulty==='Emperor'?13:11.2);s.body.grounded=false;}}}
 update(dt){const d=this.d,m=d.e.match,s=m.players[0];this.age+=dt;if(s.body.y<0){d.deaths++;d.checkpoint.restore();d.e.interaction.message('The void returns you to your checkpoint.');return;}
  if(this.phase==='guardian'&&this.guardian?.health<=0){this.phase='rage';this.guardian=null;m.players[1].spawnGuard=0;m.players[1].body.speedMultiplier=this.balance.rage;m.players[1].hitAge=0;this.lastProgress=d.elapsed;d.hint='';d.objective='Defeat the enraged AKD23';s.spawnGuard=120;const p=s.body;if(!p.support(p.x,17.001,p.z)||p.collides(p.x,17.001,p.z))p.spawn(.5,17.001,38.5);d.say(1,'You destroyed my guardian! I WILL AVENGE IT!');d.e.interaction.message('AKD23 is ENRAGED! His speed has increased.');d.checkpoint.capture('rage');}
  const health=this.phase==='guardian'?this.guardian?.health:m.players[1].health;if(health<this.previousHealth)this.lastProgress=d.elapsed;this.previousHealth=health;
  recoverChapterBoss(this,dt);const p=this.phase==='guardian'?this.guardian?.body:m.players[1].body;d.target=p?{x:p.x,z:p.z,label:this.phase==='guardian'?'DREAM DEFENDER':'AKD23'}:null;
 }
 die(index){if(index!==1||this.ending||this.d.stage!=='gameplay')return;if(this.phase==='guardian'){this.d.e.match.players[1].health=this.balance.akdHealth;return;}
  const d=this.d,e=d.e,a=e.match.players[1],p=a.body;this.ending=true;d.actors.stop();a.spawnGuard=2147483647;a.hitAge=a.regen=0;
  if(!p.support(p.x,17.001,p.z)||p.collides(p.x,17.001,p.z))p.spawn(3.5,17.001,29.5);else p.spawn(p.x,17.001,p.z);
  p.sneak=true;p.pitch=-.65;const s=e.match.players[0];s.body.spawn(.5,17.001,38.5);s.spawnGuard=2147483647;d.stage='cinematic';d.paused=false;d.target=null;e.shopTeam=e.upgradeTeam=-1;e.inventoryOpen=e.input.inventoryOpen=false;e.chatOpen=e.input.chatOpen=e.match.chat.open=false;e.input.clear();e.input.unlock();e.presentation.add(e.match,'AKD23 was slain by Ephirisi. FINAL KILL!','gold');d.scenes=new StoryScenes(d,chapterOneDefeat(p.x,p.z),()=>d.finish());e.publish();
 }
 cinematic(dt){if(!this.ending)return;const d=this.d,a=d.e.match.players[1];a.hitAge=a.regen=0;if(d.scenes?.index>=2){this.fade=Math.min(1,this.fade+dt/1.8);for(const {material} of this.materials){if(!material.transparent){material.transparent=true;material.needsUpdate=true;}material.opacity=1-this.fade;}
   if(!this.faded){d.e.fireworks.burst(a.body.x,a.body.y+1,a.body.z);this.faded=true;}if(this.fade>=1)a.alive=false;}}
 retry(){const d=this.d;if(d.checkpoint.saved?.moment==='opening')this.opening();else{d.checkpoint.restore();d.cacheResources();d.e.play();}d.e.publish();}
 snapshot(){if(this.d.stage!=='gameplay')return null;const guardian=this.phase==='guardian';return {name:guardian?"AKD23's Dream Defender":'AKD23 · ENRAGED',health:guardian?this.guardian?.health||0:this.d.e.match.players[1].health,maxHealth:guardian?this.balance.guardianHealth:this.balance.akdHealth,enraged:!guardian,bedProgress:this.bedProgress};}
}