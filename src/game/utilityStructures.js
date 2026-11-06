import { B,BUILD_HEIGHT,DIRS } from '@/game/blocks';
import { TEAMS } from '@/game/map';
import utilityPlacement from '@/game/utilityPlacement';
import voxelRaycast from '@/game/voxelRaycast';
export function popupTower(i){
 const m=i.combat,h=i.hit;if(!h.valid){i.message('Aim at a surface within reach to place the tower.');return false;}
 const x=h.x+h.nx,y=h.y+h.ny,z=h.z+h.nz;
 if(y<0||y+4>=BUILD_HEIGHT||!m.world.valid(x-2,y,z-2)||!m.world.valid(x+2,y+4,z+2)){i.message('The tower needs room below the build limit.');return false;}
 const cells=[];for(let dy=0;dy<=4;dy++)for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
  const wall=Math.abs(dx)===2||Math.abs(dz)===2,door=dx===0&&dz===-2&&(dy===1||dy===2),hatch=dx===-1&&dz===0&&dy===4;
  if((dy===0||dy===4||wall)&&!door&&!hatch&&utilityPlacement(m,x+dx,y+dy,z+dz))cells.push([x+dx,y+dy,z+dz]);
 }
 if(!cells.length){i.message('There is no clear space for the tower.');return false;}if(!i.store.consume(i.slot))return false;
 const wool=TEAMS[m.players[i.playerIndex].team].wool;for(const cell of cells)m.world.set(...cell,wool,true);
 for(let dy=1;dy<=4;dy++)if(m.world.get(x-2,y+dy,z)&&utilityPlacement(m,x-1,y+dy,z))m.world.set(x-1,y+dy,z,B.LADDER,true);
 i.message('Team tower built. The ladder leads to the roof.');return true;
}
export function zapBlocks(i){
 const m=i.combat,s=m.players[i.playerIndex],p=i.p,cp=Math.cos(p.pitch),h=i.utilityHit||(i.utilityHit={valid:false});
 voxelRaycast(m.world,p.x,p.y+p.eyeHeight,p.z,-Math.sin(p.yaw)*cp,Math.sin(p.pitch),-Math.cos(p.yaw)*cp,12,h);
 const team=h.valid?TEAMS.findIndex(t=>t.wool===h.id||t.clay===h.id||t.glass===h.id):-1;
 if(team<0||m.allied(team,s.team)||!m.world.editable(h.x,h.y,h.z)){i.message('Aim at placed enemy team-coloured blocks within 12 blocks.');return false;}
 const queue=[[h.x,h.y,h.z]],seen=new Set();let removed=0;
 for(let n=0;n<queue.length&&removed<9;n++){
  const [x,y,z]=queue[n],key=x+','+y+','+z;if(seen.has(key))continue;seen.add(key);
  if(Math.abs(x-h.x)>2||Math.abs(y-h.y)>2||Math.abs(z-h.z)>2||m.world.get(x,y,z)!==h.id||!m.world.editable(x,y,z))continue;
  m.world.set(x,y,z,0);removed++;for(const [dx,dy,dz] of DIRS)queue.push([x+dx,y+dy,z+dz]);
 }
 i.message('Zapped '+removed+' enemy blocks.');return removed>0;
}