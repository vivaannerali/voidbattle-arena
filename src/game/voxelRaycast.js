import { blockHeight,blockX,blockZ } from '@/game/blocks';
const EPS=1e-8;
function intersect(id,x,y,z,ox,oy,oz,dx,dy,dz,reach,hit){
 let near=-Infinity,far=Infinity,nx=0,ny=0,nz=0;
 for(let axis=0;axis<3;axis++){
  const origin=axis===0?ox:axis===1?oy:oz,direction=axis===0?dx:axis===1?dy:dz;
  const low=axis===0?x+blockX(id,0):axis===1?y:z+blockZ(id,0),high=axis===0?x+blockX(id,1):axis===1?y+blockHeight(id):z+blockZ(id,1);
  if(Math.abs(direction)<EPS){if(origin<low||origin>high)return false;continue;}
  const a=(low-origin)/direction,b=(high-origin)/direction,entry=Math.min(a,b),exit=Math.max(a,b);
  if(entry>near){near=entry;nx=axis===0?(direction>0?-1:1):0;ny=axis===1?(direction>0?-1:1):0;nz=axis===2?(direction>0?-1:1):0;}
  far=Math.min(far,exit);if(far<=Math.max(near,0)+EPS)return false;
 }
 if(near>reach||far<0)return false;
 hit.valid=true;hit.x=x;hit.y=y;hit.z=z;hit.id=id;hit.distance=Math.max(0,near);hit.nx=near<0?0:nx;hit.ny=near<0?0:ny;hit.nz=near<0?0:nz;return true;
}
export default function voxelRaycast(world,ox,oy,oz,dx,dy,dz,reach,hit){
 hit.valid=false;hit.distance=Infinity;
 let x=Math.floor(ox),y=Math.floor(oy),z=Math.floor(oz),distance=0;
 const sx=dx>=0?1:-1,sy=dy>=0?1:-1,sz=dz>=0?1:-1,ax=dx?Math.abs(1/dx):Infinity,ay=dy?Math.abs(1/dy):Infinity,az=dz?Math.abs(1/dz):Infinity;
 let tx=dx?(dx>0?x+1-ox:ox-x)*ax:Infinity,ty=dy?(dy>0?y+1-oy:oy-y)*ay:Infinity,tz=dz?(dz>0?z+1-oz:oz-z)*az:Infinity;
 for(let n=0;n<Math.ceil(reach*3)+3&&distance<=reach+EPS;n++){
  const id=world.get(x,y,z);if(id&&intersect(id,x,y,z,ox,oy,oz,dx,dy,dz,reach,hit))return hit;
  distance=Math.min(tx,ty,tz);if(!Number.isFinite(distance))break;
  if(tx<=distance+EPS){x+=sx;tx+=ax;}if(ty<=distance+EPS){y+=sy;ty+=ay;}if(tz<=distance+EPS){z+=sz;tz+=az;}
 }return hit;
}