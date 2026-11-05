import { TEAMS } from '@/game/map';
export function inTeamBase(body,team){const base=TEAMS[team],dx=body.x-base.x-.5,dz=body.z-base.z-.5;return dx*dx+dz*dz<=100&&Math.abs(body.y-17)<10;}

export default class TeamTraps {
 constructor(match,teams){this.match=match;this.teams=teams;this.inside=new Uint8Array(teams.length*match.players.length);}
 tick(){const players=this.match.players,n=players.length;for(let t=0;t<this.teams.length;t++){const state=this.teams[t];if(state.cooldown>0)state.cooldown--;for(let i=0;i<n;i++){const player=players[i],key=t*n+i;if(player.team===t)continue;const inside=player.alive&&inTeamBase(player.body,t),entered=inside&&!this.inside[key];this.inside[key]=inside?1:0;if(entered&&state.trapCount>0&&state.cooldown===0){const trap=state.traps[0];state.traps.copyWithin(0,1,state.trapCount);state.traps[--state.trapCount]=0;state.cooldown=1200;this.trigger(t,i,trap);}}}}
 trigger(team,enemy,trap){const players=this.match.players,effect=players[enemy].effects;
  if(trap===1){effect.blindnessTicks=Math.max(effect.blindnessTicks,480);effect.slownessTicks=Math.max(effect.slownessTicks,480);}
  else if(trap===2){for(let i=0;i<players.length;i++){const p=players[i];if(p.alive&&p.team===team){p.effects.speedTicks=Math.max(p.effects.speedTicks,900);p.effects.jumpTicks=Math.max(p.effects.jumpTicks,900);}}}
  else if(trap===3){for(let i=0;i<players.length;i++){const p=players[i];if(p.alive&&p.team!==team&&inTeamBase(p.body,team)){p.effects.invisibilityTicks=0;p.effects.revealTicks=Math.max(p.effects.revealTicks,600);}}}
  else if(trap===4)effect.fatigueTicks=Math.max(effect.fatigueTicks,600);
  this.match.emit(9,team,enemy,trap);
 }
}