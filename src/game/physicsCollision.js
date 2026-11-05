import { blockHeight,isLadder } from '@/game/blocks';
const EPS=.00001,R=.3;
export function intersectsBlocks(body,x,y,z,height=body.height){
 const w=body.world;
 for(let bx=Math.floor(x-R+EPS);bx<=Math.floor(x+R-EPS);bx++)for(let by=Math.floor(y+EPS);by<=Math.floor(y+height-EPS);by++)for(let bz=Math.floor(z-R+EPS);bz<=Math.floor(z+R-EPS);bz++){
  const id=w.get(bx,by,bz);if(id&&!isLadder(id)&&y<by+blockHeight(id)-EPS&&y+height>by+EPS)return true;
 }return false;
}
export function supportsFeet(body,x,y,z){
 for(let bx=Math.floor(x-R+EPS);bx<=Math.floor(x+R-EPS);bx++)for(let bz=Math.floor(z-R+EPS);bz<=Math.floor(z+R-EPS);bz++)for(let by=Math.floor(y-.08);by<=Math.floor(y+EPS);by++){
  const id=body.world.get(bx,by,bz);if(!id||isLadder(id))continue;const top=by+blockHeight(id);if(top<=y+EPS&&top>=y-.08)return true;
 }return false;
}
export function sweepAxis(body,axis,delta){
 if(!delta)return;
 const x0=body.x-R,x1=body.x+R,y0=body.y,y1=body.y+body.height,z0=body.z-R,z1=body.z+R;
 let allowed=delta;
 for(let x=Math.floor(x0+(axis===0?Math.min(0,delta):0)+EPS);x<=Math.floor(x1+(axis===0?Math.max(0,delta):0)-EPS);x++)
 for(let y=Math.floor(y0+(axis===1?Math.min(0,delta):0)+EPS);y<=Math.floor(y1+(axis===1?Math.max(0,delta):0)-EPS);y++)
 for(let z=Math.floor(z0+(axis===2?Math.min(0,delta):0)+EPS);z<=Math.floor(z1+(axis===2?Math.max(0,delta):0)-EPS);z++){
  const id=body.world.get(x,y,z);if(!id||isLadder(id))continue;const top=y+blockHeight(id);
  if(axis!==0&&(x1<=x+EPS||x0>=x+1-EPS)||axis!==1&&(y1<=y+EPS||y0>=top-EPS)||axis!==2&&(z1<=z+EPS||z0>=z+1-EPS))continue;
  const low=axis===0?x:axis===1?y:z,high=axis===0?x+1:axis===1?top:z+1,min=axis===0?x0:axis===1?y0:z0,max=axis===0?x1:axis===1?y1:z1;
  if(delta>0&&low>=max-EPS)allowed=Math.min(allowed,Math.max(0,low-max));
  if(delta<0&&high<=min+EPS)allowed=Math.max(allowed,Math.min(0,high-min));
 }
 if(axis===0){body.x+=allowed;if(allowed!==delta)body.vx=0;}
 else if(axis===2){body.z+=allowed;if(allowed!==delta)body.vz=0;}
 else{body.y+=allowed;if(allowed!==delta){if(delta<0)body.grounded=true;body.vy=0;}}
}