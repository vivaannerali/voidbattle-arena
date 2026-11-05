import BotGrid from '@/game/botGrid';
import BotBrain from '@/game/botBrain';
import BotEconomy from '@/game/botEconomy';
import { BOT_DIFFICULTIES } from '@/game/botSettings';
import { TEAMS,DIAMOND_ISLANDS } from '@/game/map';
import { basePoint,defencePlan } from '@/game/botConstruction';
export default class BotDirector {
 constructor(match){this.match=match;this.difficulty=BOT_DIFFICULTIES[match.settings.difficulty];this.grid=new BotGrid(match.world);this.economy=new BotEconomy(match);this.defences=TEAMS.map((_,i)=>defencePlan(i));this.baseCenters=TEAMS.map(t=>({x:t.x+.5,z:t.z+.5}));this.generators=TEAMS.map((_,i)=>basePoint(i,0,6.5));this.shops=TEAMS.map((_,i)=>basePoint(i,-4,4));this.upgrades=TEAMS.map((_,i)=>basePoint(i,4,4));this.builders=new Int16Array(TEAMS.length);this.builders.fill(-1);this.brains=[];this.worker=0;for(let i=1;i<match.players.length;i++){const player=match.players[i],brain=new BotBrain(this,i);player.bot=brain;this.brains.push(brain);if(this.builders[player.team]<0)this.builders[player.team]=i;}}
 tick(){for(let i=0;i<this.brains.length;i++)this.brains[i].tick();for(let n=0;n<this.brains.length;n++){const brain=this.brains[this.worker++%this.brains.length];if(brain.player.alive&&brain.nav.searching){brain.nav.step(96);break;}}}
 nearestTeam(bot){const team=TEAMS[bot.player.team];let target=-1,best=Infinity;for(let n=0;n<TEAMS.length;n++){const i=(n+bot.index)%TEAMS.length;if(i===bot.player.team||this.match.eliminated[i]||!this.match.beds[i])continue;const t=TEAMS[i],distance=Math.hypot(t.x-team.x,t.z-team.z);if(distance<best){target=i;best=distance;}}return target;}
 resourcePoint(bot,emerald){const entries=this.match.generators.entries,p=bot.player.body;const diamonds=TEAMS.length*2,start=emerald?diamonds+DIAMOND_ISLANDS.length:diamonds,end=start+(emerald?2:DIAMOND_ISLANDS.length);let chosen=entries[start],best=Infinity;for(let i=start;i<end;i++){const g=entries[i],enemy=bot.enemyTeam>=0?TEAMS[bot.enemyTeam]:TEAMS[bot.player.team],score=Math.hypot(g.x-p.x,g.z-p.z)+(emerald?0:.4*Math.hypot(g.x-enemy.x,g.z-enemy.z));if(score<best){best=score;chosen=g;}}return chosen;}
}