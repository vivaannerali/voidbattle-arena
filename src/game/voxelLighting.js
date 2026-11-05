import { DIRS,CORNERS,blockHeight,isGlass,isLadder } from '@/game/blocks';
export const FLIPPED_TRI=[0,1,3,1,2,3];
function solid(world,x,y,z){const id=world.get(x,y,z);return id!==0&&!isGlass(id)&&!isLadder(id)&&blockHeight(id)===1?1:0;}
export default function vertexLight(world,x,y,z,face,corner){
 const normal=DIRS[face],co=CORNERS[face],a=face<2?1:0,b=face<4?2:1,sa=co[corner*3+a]?1:-1,sb=co[corner*3+b]?1:-1;
 const nx=x+normal[0],ny=y+normal[1],nz=z+normal[2],ax=a===0?sa:0,ay=a===1?sa:0,az=a===2?sa:0,bx=b===0?sb:0,by=b===1?sb:0,bz=b===2?sb:0;
 const one=solid(world,nx+ax,ny+ay,nz+az),two=solid(world,nx+bx,ny+by,nz+bz),diagonal=solid(world,nx+ax+bx,ny+ay+by,nz+az+bz);
 return 1-.16*(one&&two?3:one+two+diagonal);
}