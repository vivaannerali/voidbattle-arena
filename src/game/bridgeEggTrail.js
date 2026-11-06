import { TEAMS } from '@/game/map';
import utilityPlacement from '@/game/utilityPlacement';
export default function bridgeEggTrail(match,egg){
 const s=match.players[egg.source];if(!s)return;
 const x=Math.floor(egg.x),y=Math.floor(egg.y)-2,z=Math.floor(egg.z),key=x+','+y+','+z;if(egg.trailKey===key)return;egg.trailKey=key;
 const sideX=Math.abs(egg.vz)>=Math.abs(egg.vx)?1:0,sideZ=sideX?0:1;
 for(let side=-1;side<=1;side++){const tx=x+sideX*side,tz=z+sideZ*side;if(utilityPlacement(match,tx,y,tz))match.world.set(tx,y,tz,TEAMS[s.team].wool,true);}
}