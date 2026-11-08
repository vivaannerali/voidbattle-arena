import StoryActors from '@/game/story/StoryActors';
import StoryScenes from '@/game/story/StoryScenes';
import StoryCheckpoint from '@/game/story/StoryCheckpoint';
import StoryVisuals from '@/game/story/storyVisuals';
import storyControls from '@/game/story/storyControls';
import prologueScenes from '@/game/story/prologueScenes';
import { startStoryTutorial,tickStoryTutorial } from '@/game/story/storyTutorial';
import { completeStoryChapter } from '@/game/story/storyProgress';
import ChapterOne from '@/game/story/ChapterOne';
export default class StoryDirector {
 constructor(engine,difficulty,resume,chapter=resume?.chapter||'prologue'){this.e=engine;this.chapter=chapter;this.difficulty=difficulty;this.stage='cinematic';this.elapsed=resume?.elapsed||0;this.damage=resume?.damage||0;this.deaths=resume?.deaths||0;this.collected=false;this.objectiveAge=0;this.skipAge=0;this.paused=false;this.saved=true;this.savedAt=-100;this.actors=new StoryActors(engine);this.visuals=new StoryVisuals(engine);this.checkpoint=new StoryCheckpoint(this);this.disposeControls=storyControls(this);
  const m=engine.match;m.phase='active';engine.started=true;m.chat.enabled=false;m.botDirector.tick=()=>{this.actors.tick();this.encounter?.tick();};m.timeline.tick=()=>{};m.checkVictory=()=>{};m.destroyBed=()=>false;m.die=index=>{if(index===0){this.recordDamage();this.deaths++;this.checkpoint.saveStats();this.stage='failed';this.pause();}else this.encounter?.die(index);};for(const s of m.players.slice(1))s.spawnGuard=2147483647;
  this.encounter=chapter==='chapter1'?new ChapterOne(this):null;m.players[0].body.spawn(.5,17.001,34.5);this.lastHealth=20;if(resume)this.checkpoint.saved=resume;else this.checkpoint.capture('opening');
  this.playOpening();if(resume&&resume.moment!=='opening'){if(this.encounter)this.encounter.start(resume);else startStoryTutorial(this,resume);}else if(difficulty==='Story'){m.players[0].effects.absorption=10;m.players[0].effects.absorptionTicks=2147483647;}
 }
 playOpening(){if(this.encounter)this.encounter.opening();else this.scenes=new StoryScenes(this,prologueScenes(),()=>startStoryTutorial(this));}
 recordDamage(){const s=this.e.match.players[0],ticks=s.effects.absorptionTicks,previousTicks=this.lastAbsorptionTicks??ticks,shieldHit=ticks>0&&previousTicks>=ticks&&previousTicks-ticks<=1;this.damage+=Math.max(0,(this.lastHealth??s.health)-s.health)+(shieldHit?Math.max(0,(this.lastAbsorption??s.effects.absorption)-s.effects.absorption):0);this.lastHealth=s.health;this.lastAbsorption=s.effects.absorption;this.lastAbsorptionTicks=ticks;}
 say(index,text){const chat=this.e.match.chat;chat.add(index,text,'all');if(chat.messages.length)chat.messages[chat.messages.length-1].bot=false;}
 get thirdPerson(){return this.stage==='cinematic';}
 get timeScale(){return this.paused||this.stage==='complete'||this.stage==='failed'?0:this.scenes?.step?.slowMotion||1;}
 update(dt){if(this.paused||this.stage==='failed'||this.stage==='complete')return;this.elapsed+=dt;this.actors.update(dt);if(this.stage==='cinematic'){this.scenes?.update(dt);this.encounter?.cinematic(dt);this.skipAge=this.skipHeld?this.skipAge+dt:0;if(this.skipAge>=1.1){this.skipHeld=false;this.skipAge=0;this.scenes?.skip();}}else if(this.encounter)this.encounter.update(dt);else tickStoryTutorial(this,dt);}
 tick(){if(!this.timeScale)return;const e=this.e;e.match.tick();this.recordDamage();if(this.stage==='gameplay')this.encounter?.afterTick();if(this.stage==='gameplay'&&e.input.active&&e.match.canPlay())e.interaction.tick();else{e.input.attackPresses=0;e.interaction.progress=0;e.interaction.hit.valid=false;}e.time+=1/60;}
 render(){if(this.thirdPerson){this.scenes?.render(this.e.camera);this.e.held.visible=false;}this.visuals.render(this.stage==='gameplay'?this.target:null,this.elapsed);}
 cacheResources(){const drops=this.e.generators.drops;if(drops.counts.reduce((n,v,i)=>n+(drops.owner[i]===-1?v:0),0)<16){drops.spawn(40,80,.25,17.14,40.5);drops.spawn(41,24,.8,17.14,40.5);}}
 menu(mode){if(this.stage==='gameplay'){if(['paused','click-resume','lock-error'].includes(mode))this.paused=true;else if(mode==='playing')this.paused=false;}}
 pause(){this.paused=true;this.skipHeld=false;this.e.input.clear();this.e.input.unlock();this.e.publish();}
 resume(){if(this.stage==='failed'||this.stage==='complete')return;this.paused=false;if(this.stage==='gameplay')this.e.play();this.e.publish();}
 retry(){this.skipAge=0;this.skipHeld=false;if(this.encounter){this.encounter.retry();return;}const saved=this.checkpoint.saved;if(saved?.moment==='opening'){this.stage='cinematic';this.scenes=new StoryScenes(this,prologueScenes(),()=>startStoryTutorial(this));this.paused=false;this.actors.stop();for(const [index,s] of this.e.match.players.entries())s.body.spawn(index===0?.5:index===1?-2:2,17.001,index===0?34.5:-34.5);}else{this.checkpoint.restore();this.cacheResources();this.e.play();}this.e.publish();}
 finish(){if(this.stage==='complete')return;this.result=completeStoryChapter(this.chapter,this.difficulty,this.elapsed,this.deaths,this.damage);this.stage='complete';this.target=null;this.e.input.unlock();this.e.publish();}
 snapshot(){return {chapter:this.chapter,chapterTitle:this.chapter==='chapter1'?'CHAPTER I':'PROLOGUE',boss:this.encounter?.snapshot(),stage:this.stage,paused:this.paused,difficulty:this.difficulty,elapsed:this.elapsed,deaths:this.deaths,damage:this.damage,objective:this.objective,hint:this.hint,waypoint:this.visuals.waypoint(this.target),scene:this.scenes?.snapshot(),skip:Math.min(1,this.skipAge/1.1),saved:this.saved,savedRecently:this.elapsed-this.savedAt<4,result:this.result};}
 dispose(){this.disposeControls();this.visuals.dispose();}
}