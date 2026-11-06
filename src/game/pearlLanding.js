import { blockHeight } from '@/game/blocks';
export default function pearlLanding(match,pearl,hit){
 const s=match.players[pearl.source];if(!s?.alive)return;
 const p=s.body,x=pearl.x+hit.nx*.36,z=pearl.z+hit.nz*.36,y=hit.ny>0?hit.y+blockHeight(hit.id)+.001:hit.ny<0?hit.y-p.height-.001:Math.floor(pearl.y)+.001;
 let fallback=null,landing=null;
 for(const dy of [0,1,-1,2]){for(const dx of [0,-.5,.5]){for(const dz of [0,-.5,.5]){
  const tx=x+dx,ty=y+dy,tz=z+dz;if(ty<0||ty+p.height>=64||!match.world.valid(Math.floor(tx),Math.floor(ty),Math.floor(tz))||p.collides(tx,ty,tz))continue;
  if(match.players.some(other=>other!==s&&other.alive&&Math.abs(other.body.x-tx)<.61&&Math.abs(other.body.z-tz)<.61&&other.body.y<ty+p.height&&other.body.y+other.body.height>ty))continue;
  let occupied=false;for(let level=0;level<2;level++)if(match.interaction.shops?.overlaps(Math.floor(tx),Math.floor(ty)+level,Math.floor(tz))||match.interaction.upgradesNPCs?.overlaps(Math.floor(tx),Math.floor(ty)+level,Math.floor(tz)))occupied=true;
  if(occupied)continue;if(!fallback)fallback=[tx,ty,tz];if(p.support(tx,ty,tz)){landing=[tx,ty,tz];break;}
 }if(landing)break;}if(landing)break;}
 landing=landing||fallback;
 if(!landing){s.interaction?.message('Your pearl hit, but there is no clear landing space.');return;}
 p.spawn(...landing);s.teleportSequence=(s.teleportSequence||0)+1;s.spawnGuard=0;s.interaction?.message('Ender Pearl landed.');match.fireworks.burst(p.x,p.y+1,p.z);
}