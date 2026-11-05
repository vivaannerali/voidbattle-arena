import { TEAMS } from '@/game/map';
import { BUILD_HEIGHT } from '@/game/blocks';
export default function safeSpawn(body,team,slot,members=[]){
 const t=TEAMS[team],side=slot===0?0:slot===1?-2:slot===2?2:3,s=Math.round(Math.sin(t.rotation)),c=Math.round(Math.cos(t.rotation));
 for(let level=17;level<=BUILD_HEIGHT+1;level++)for(let ring=0;ring<=6;ring++)for(let lx=-4;lx<=4;lx++)for(let lz=-3;lz<=2;lz++){
  if(Math.abs(lx-side)+Math.abs(lz-1)!==ring)continue;
  const x=t.x+lx*c+lz*s+.5,z=t.z-lx*s+lz*c+.5,y=level+.001;
  if(body.collides(x,y,z,1.8)||!body.support(x,y,z))continue;
  if(members.some(p=>p.alive&&p.body!==body&&Math.abs(p.body.x-x)<.6&&Math.abs(p.body.z-z)<.6&&p.body.y<y+1.8&&p.body.y+p.body.height>y))continue;
  body.spawn(x,y,z);body.yaw=t.rotation;body.pitch=-.08;return true;
 }return false;
}