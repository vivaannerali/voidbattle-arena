import * as THREE from 'three';
import { atlasU,atlasV } from '@/game/atlasLayout';
let pixels=null;
export function setSpritePixels(data){pixels=data;}
export default function pixelSpriteGeometry(tile){
 const positions=[],uv=[],colors=[],ox=tile%8*16,oy=Math.floor(tile/8)*16,step=.95/16,depth=.055;
 const opaque=(x,y)=>x>=0&&x<16&&y>=0&&y<16&&pixels&&pixels[((oy+y)*128+ox+x)*4+3]>100;
 function face(x,y,a,b,c,d,shade){for(const n of [a,b,c,a,c,d]){positions.push(n[0],n[1],n[2]);uv.push(atlasU(tile,x+.5),atlasV(tile,y+.5));colors.push(shade,shade,shade);}}
 for(let y=0;y<16;y++)for(let x=0;x<16;x++)if(opaque(x,y)){
  const l=(x-8)*step,r=l+step,t=(8-y)*step,b=t-step,z=depth/2;
  face(x,y,[l,b,z],[r,b,z],[r,t,z],[l,t,z],1);face(x,y,[r,b,-z],[l,b,-z],[l,t,-z],[r,t,-z],.8);
  if(!opaque(x-1,y))face(x,y,[l,b,-z],[l,b,z],[l,t,z],[l,t,-z],.6);
  if(!opaque(x+1,y))face(x,y,[r,b,z],[r,b,-z],[r,t,-z],[r,t,z],.6);
  if(!opaque(x,y-1))face(x,y,[l,t,z],[r,t,z],[r,t,-z],[l,t,-z],1);
  if(!opaque(x,y+1))face(x,y,[l,b,-z],[r,b,-z],[r,b,z],[l,b,z],.5);
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.computeBoundingSphere();return g;
}