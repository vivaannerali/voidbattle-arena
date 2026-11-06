import { TEAMS } from '@/game/map';
export const GAME_EVENTS=[{name:'Diamond II',at:360},{name:'Emerald II',at:720},{name:'Diamond III',at:1080},{name:'Emerald III',at:1440},{name:'Bed Gone',at:1800},{name:'Sudden Death',at:2400},{name:'Game End',at:3000}];
export function timerText(seconds){const n=Math.max(0,seconds);return Math.floor(n/60)+':'+String(n%60).padStart(2,'0');}

export default class GameEvents {
 constructor(match,generators){this.match=match;this.generators=generators;this.elapsed=0;this.index=0;this.suddenDeath=false;this.border=96;}
 tick(){this.elapsed++;if(this.index<GAME_EVENTS.length&&this.elapsed>=GAME_EVENTS[this.index].at*60){const index=this.index++;this.match.emit(7,index);if(index===0)this.generators.upgrade(42,2);else if(index===1)this.generators.upgrade(43,2);else if(index===2)this.generators.upgrade(42,3);else if(index===3)this.generators.upgrade(43,3);else if(index===4)this.destroyBeds();else if(index===5)this.suddenDeath=true;else if(index===6)this.endGame();}
  if(this.suddenDeath&&this.match.phase==='active'){this.border=Math.max(6,96-90*(this.elapsed-2400*60)/(600*60));if(this.elapsed%60===0)for(let i=0;i<this.match.players.length;i++){const p=this.match.players[i];if(p.alive&&Math.hypot(p.body.x,p.body.z)>this.border){p.health=Math.max(0,p.health-2);p.hitFlash=10;p.hitAge=0;if(p.health<=0)this.match.die(i,p.attackAge<600?p.lastAttacker:-1);}}}
 }
 destroyBeds(){for(let i=0;i<TEAMS.length;i++)this.match.destroyBed(i,-1);}
 endGame(){if(this.match.phase==='finished')return;const winner=-2;this.match.winner=winner;this.match.finishedByTime=true;this.match.phase='finished';this.match.endAt=this.match.clock+150;this.match.emit(5,winner,0,1);}
 snapshot(){const next=GAME_EVENTS[this.index];return {nextEvent:next?.name||'Game End',eventSeconds:next?Math.max(0,Math.ceil((next.at*60-this.elapsed)/60)):0,elapsedSeconds:Math.floor(this.elapsed/60),suddenDeath:this.suddenDeath,border:Math.round(this.border)};}
}