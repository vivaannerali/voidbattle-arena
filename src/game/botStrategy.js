import { TEAMS } from '@/game/map';
import { basePoint } from '@/game/botConstruction';
import { BED_SHIFT } from '@/game/bedLayout';
export function shouldDefend(bot){
 const m=bot.match,home=bot.director.baseCenters[bot.player.team],distance=p=>Math.hypot(p.body.x-home.x,p.body.z-home.z);
 if(distance(bot.player)<20)return true;
 const defenders=bot.director.brains.filter(b=>b.player.alive&&b.player.team===bot.player.team);
 return defenders.every(b=>b===bot||distance(b.player)>distance(bot.player)||distance(b.player)===distance(bot.player)&&b.index>bot.index);
}
export function tacticalRetreat(bot){
 const m=bot.match,p=bot.player,body=p.body,home=bot.director.generators[p.team];
 let enemies=0,friends=1;
 for(const other of m.players){if(other===p||!other.alive||Math.hypot(other.body.x-body.x,other.body.z-body.z)>7)continue;if(m.allied(other.team,p.team))friends++;else if((!other.effects.invisibilityTicks||other.effects.revealTicks)&&m.lineClear(body.x,body.y+1.4,body.z,other.body.x,other.body.y+1,other.body.z))enemies++;}
 const valuable=p.inventory.total(42)>0||p.inventory.total(43)>0;
 const retreat=bot.action==='retreat'?p.health<14:p.health<=6||enemies>friends&&p.health<12&&(valuable||!m.beds[p.team]);
 if(!retreat){if(bot.action==='retreat')bot.action='idle';return false;}
 bot.target=-1;bot.go('retreat',home.x,home.z);return true;
}
export function strategicResourceTrip(bot){
 const m=bot.match,p=bot.player,time=m.timeline?.elapsed||0;
 if(time<45*60||m.clock-bot.lastGemAt<45*60)return false;
 const team=bot.director.brains.filter(b=>b.player.team===p.team),collector=team.length>1?team[team.length-1]:team[0];
 if(collector!==bot||team.length===1&&time<90*60&&bot.trip===0)return false;
 const emerald=time>=180*60&&bot.trip%3===2,point=bot.director.resourcePoint(bot,emerald);
 if(!point)return false;
 bot.waitUntil=0;bot.go(emerald?'emerald':'diamond',point.x,point.z);return true;
}
export function coordinatedRush(bot){
 const m=bot.match,team=TEAMS[bot.player.team];let target=-1,best=Infinity;
 for(let i=0;i<TEAMS.length;i++){if(m.allied(i,bot.player.team)||m.eliminated[i]||!m.beds[i])continue;const t=TEAMS[i],distance=Math.hypot(t.x-team.x,t.z-team.z);if(distance<best){best=distance;target=i;}}
 return target;
}
export function rushPoint(bot){
 const offset=bot.player.slot%2===0?-2:2;
 return basePoint(bot.enemyTeam,offset,1-BED_SHIFT);
}