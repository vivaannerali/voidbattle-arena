import BotGrid from '@/game/botGrid';
import BotBrain from '@/game/botBrain';
import BotEconomy from '@/game/botEconomy';
import { BOT_DIFFICULTIES } from '@/game/botSettings';
import { TEAMS } from '@/game/map';
import { basePoint,defencePlan } from '@/game/botConstruction';
export default class BotDirector {
 constructor(match){this.match=match;this.difficulty=BOT_DIFFICULTIES[match.settings.difficulty];this.grid=new BotGrid(match.world);this.economy=new BotEconomy(match);this.defences=TEAMS.map((_,i)=>defencePlan(i));this.baseCenters=TEAMS.map(t=>({x:t.x+.5,z:t.z+.5}));this.generators=TEAMS.map((_,i)=>basePoint(i,0,6.5));this.shops=TEAMS.map((_,i)=>basePoint(i,-4,4));this.upgrades=TEAMS.map((_,i)=>basePoint(i,4,4));this.builders=new Int16Array(4);this.builders.fill(-1);this.brains=[];this.worker=0;for(let i=1;i<match.players.length;i++){const player=match.players[i],brain=new BotBrain(this,i);player.bot=brain;this.brains.push(brain);if(this.builders[player.team]<0)this.builders[player.team]=i;}}
 tick(){for(let i=0;i<this.brains.length;i++)this.brains[i].tick();for(let n=0;n<this.brains.length;n++){const brain=this.brains[this.worker++%this.brains.length];if(brain.player.alive&&brain.nav.searching){brain.nav.step(96);break;}}}
 nearestTeam(bot){const team=TEAMS[bot.player.team];let target=-1,best=Infinity;for(let n=0;n<4;n++){const i=(n+bot.index)%4;if(i===bot.player.team||this.match.eliminated[i]||!this.match.beds[i])continue;const t=TEAMS[i],distance=Math.hypot(t.x-team.x,t.z-team.z);if(distance<best){target=i;best=distance;}}return target;}
 resourcePoint(bot,emerald){const entries=this.match.generators.entries,p=bot.player.body;let chosen=entries[emerald?12:8],best=Infinity;for(let i=emerald?12:8;i<(emerald?14:12);i++){const g=entries[i],enemy=bot.enemyTeam>=0?TEAMS[bot.enemyTeam]:TEAMS[bot.player.team],score=Math.hypot(g.x-p.x,g.z-p.z)+(emerald?0:.4*Math.hypot(g.x-enemy.x,g.z-enemy.z));if(score<best){best=score;chosen=g;}}return chosen;}
}