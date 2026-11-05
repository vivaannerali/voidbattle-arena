import { TEAM_UPGRADES,TRAPS,TRAP_COSTS,teamOffers,purchasedUpgradeName,FORGE_NAMES } from '@/game/teamUpgradeCatalog';
import TeamTraps,{inTeamBase} from '@/game/teamTraps';
import { isSword,TEAM_NAMES } from '@/game/equipment';

export default class TeamUpgrades {
 constructor(match){this.match=match;this.teams=Array.from({length:4},()=>({sharpness:0,protection:0,haste:0,forge:0,heal:0,traps:new Uint8Array(3),trapCount:0,cooldown:0}));this.trapSystem=new TeamTraps(match,this.teams);}
 offers(playerIndex=0){return teamOffers(this.teams[this.match.players[playerIndex].team]);}
 purchase(playerIndex,key){const player=this.match.players[playerIndex];if(!player?.alive||this.match.phase!=='active')return {ok:false,message:'You cannot buy upgrades while spectating.'};const state=this.teams[player.team],upgradeIndex=TEAM_UPGRADES.findIndex(def=>def.key===key),trapIndex=TRAPS.findIndex(def=>def.key===key);let cost,level=0,index=upgradeIndex;
  if(upgradeIndex>=0){const def=TEAM_UPGRADES[upgradeIndex];if(state[key]>=def.costs.length)return {ok:false,message:'Your team already owns the maximum tier!'};level=state[key]+1;cost=def.costs[level-1];}
  else if(trapIndex>=0){if(state.trapCount>=3)return {ok:false,message:'Trap queue is full (3/3)!'};cost=TRAP_COSTS[state.trapCount];index=TEAM_UPGRADES.length+trapIndex;}
  else return {ok:false,message:'Upgrade unavailable.'};
  if(!player.inventory.spend(42,cost))return {ok:false,message:"You don't have enough Diamonds!"};
  if(upgradeIndex>=0){state[key]=level;if(key==='forge')this.match.generators.applyForge(player.team,level);}else state.traps[state.trapCount++]=trapIndex+1;
  this.match.emit(8,playerIndex,index,level);return {ok:true,message:(trapIndex>=0?'Queued ':'Purchased ')+purchasedUpgradeName(index,level)+' for your team!'};
 }
 tick(){this.trapSystem.tick();for(let i=0;i<this.match.players.length;i++){const player=this.match.players[i];if(!player.alive)continue;player.effects.tick(player);const state=this.teams[player.team];if(state.heal&&this.match.clock%150===0&&inTeamBase(player.body,player.team))player.health=Math.min(20,player.health+1);}}
 swordDamage(playerIndex,damage,weapon){return damage+(this.teams[this.match.players[playerIndex].team].sharpness&&isSword(weapon)?1.25:0);}
 protection(playerIndex,damage){return damage*(1-this.teams[this.match.players[playerIndex].team].protection*.16);}
 miningRate(playerIndex){const player=this.match.players[playerIndex];return (1+this.teams[player.team].haste*.2)*(player.effects.fatigueTicks>0?.3:1);}
 status(playerIndex=0){const player=this.match.players[playerIndex],state=this.teams[player.team];return {teamName:TEAM_NAMES[player.team],sharpness:state.sharpness,protection:state.protection,haste:state.haste,forge:state.forge,forgeName:state.forge?FORGE_NAMES[state.forge-1]:'Base Forge',heal:state.heal,healActive:!!state.heal&&player.alive&&inTeamBase(player.body,player.team),traps:Array.from(state.traps.subarray(0,state.trapCount),id=>({...TRAPS[id-1],trapId:id})),trapCount:state.trapCount,trapCost:TRAP_COSTS[Math.min(2,state.trapCount)],cooldown:Math.ceil(state.cooldown/60)};}
}