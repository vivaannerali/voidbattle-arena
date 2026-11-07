import { basePoint } from '@/game/botConstruction';
import { BED_FOOT_Z } from '@/game/bedLayout';
import { B,isWool,isLadder } from '@/game/blocks';
import voxelRaycast from '@/game/voxelRaycast';
export default function botFireballDefence(bot){
 const m=bot.match,p=bot.player.body,team=bot.enemyTeam;
 if(bot.action!=='attack'||team<0||!m.beds[team])return null;
 const point=basePoint(team,0,BED_FOOT_Z),dx=point.x-p.x,dy=17.3-p.y-p.eyeHeight,dz=point.z-p.z,length=Math.hypot(dx,dy,dz);
 if(length<8||length>38)return null;
 const hit=voxelRaycast(m.world,p.x,p.y+p.eyeHeight,p.z,dx/length,dy/length,dz/length,length,bot.fireballHit??={valid:false});
 if(!hit.valid||!m.world.editable(hit.x,hit.y,hit.z)||!(isWool(hit.id)||hit.id===B.OAK||isLadder(hit.id)))return null;
 const f=(hit.distance+.03)/length,target={x:p.x+dx*f,y:p.y+p.eyeHeight+dy*f,z:p.z+dz*f};
 if(m.players.some(s=>s.alive&&m.allied(bot.player.team,s.team)&&Math.hypot(s.body.x-target.x,s.body.y+.9-target.y,s.body.z-target.z)<5))return null;
 return target;
}