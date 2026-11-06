import * as THREE from 'three';
import voxelRaycast from '@/game/voxelRaycast';
import tntBlast from '@/game/tntBlast';
import { B,isWool,isLadder } from '@/game/blocks';
export const FIREBALL_ID=75;
const SPEED=22;
export default class FireballSystem {
 constructor(match){this.match=match;this.entries=new Map();this.sequence=0;this.hit={valid:false};this.ray=new THREE.Ray();this.geometry=new THREE.IcosahedronGeometry(.23,1);this.material=new THREE.MeshBasicMaterial({color:0xffa32c});this.remote=false;}
 launch(source,dx,dy,dz){
  const m=this.match,s=m.players[source],length=Math.hypot(dx,dy,dz);
  if(m.phase!=='active'||!s?.alive||!Number.isFinite(length)||length<.001||m.clock<(s.fireballAt||0)||this.entries.size>=24||!s.inventory.spend(FIREBALL_ID,1))return false;
  const p=s.body;s.fireballAt=m.clock+60;s.spawnGuard=0;s.swingTicks=12;
  this.add({id:++this.sequence,source,x:p.x,y:p.y+p.eyeHeight,z:p.z,vx:dx/length*SPEED,vy:dy/length*SPEED,vz:dz/length*SPEED,due:m.clock+240});return true;
 }
 add(data){const mesh=new THREE.Mesh(this.geometry,this.material);this.match.world.scene.add(mesh);this.entries.set(data.id,{...data,px:data.x,py:data.y,pz:data.z,mesh});mesh.position.set(data.x,data.y,data.z);}
 remove(b){this.match.world.scene.remove(b.mesh);this.entries.delete(b.id);}
 explode(b){this.remove(b);tntBlast(this.match,b,{radius:2.2,breakable:id=>isWool(id)||id===B.OAK||isLadder(id)});}
 tick(){for(const b of this.entries.values()){
  b.px=b.x;b.py=b.y;b.pz=b.z;const dx=b.vx/60,dy=b.vy/60,dz=b.vz/60,step=SPEED/60;
  voxelRaycast(this.match.world,b.x,b.y,b.z,dx/step,dy/step,dz/step,step,this.hit);let distance=this.hit.valid?this.hit.distance:Infinity;
  for(let i=0;i<this.match.players.length;i++){
   const s=this.match.players[i];if(i===b.source||!s.alive)continue;const p=s.body;
   const t=Math.max(0,Math.min(1,((p.x-b.x)*dx+(p.y+.9-b.y)*dy+(p.z-b.z)*dz)/(step*step)));
   if(Math.hypot(p.x-b.x-dx*t,p.y+.9-b.y-dy*t,p.z-b.z-dz*t)<.65)distance=Math.min(distance,t*step);
  }
  const travel=Number.isFinite(distance)?Math.max(0,distance-.03):step;b.x+=dx/step*travel;b.y+=dy/step*travel;b.z+=dz/step*travel;
  if(Number.isFinite(distance))this.explode(b);else if(this.match.clock>=b.due)this.remove(b);
 }}
 render(alpha){for(const b of this.entries.values()){const age=this.remote?Math.min(.15,(performance.now()-b.receivedAt)/1000):0;
  b.mesh.position.set(this.remote?b.x+b.vx*age:b.px+(b.x-b.px)*alpha,this.remote?b.y+b.vy*age:b.py+(b.y-b.py)*alpha,this.remote?b.z+b.vz*age:b.pz+(b.z-b.pz)*alpha);b.mesh.rotation.x+=.03;b.mesh.rotation.y+=.05;
 }}
 snapshot(){return Array.from(this.entries.values(),({id,source,x,y,z,vx,vy,vz,due})=>({id,source,x,y,z,vx,vy,vz,due}));}
 sync(items=[]){this.remote=true;const ids=new Set(items.map(b=>b.id));for(const b of this.entries.values())if(!ids.has(b.id)){if(this.match.clock<b.due)this.match.fireworks.burst(b.x,b.y,b.z);this.remove(b);}for(const data of items){if(!this.entries.has(data.id))this.add(data);Object.assign(this.entries.get(data.id),data,{receivedAt:performance.now()});}}
 dispose(){for(const b of this.entries.values())this.remove(b);this.geometry.dispose();this.material.dispose();}
}