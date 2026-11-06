import * as THREE from 'three';
import voxelRaycast from '@/game/voxelRaycast';
import { THROWN_UTILITIES } from '@/game/utilityItems';
import arrowCollision from '@/game/arrowCollision';
import pearlLanding from '@/game/pearlLanding';
import bridgeEggTrail from '@/game/bridgeEggTrail';
import windBurst from '@/game/windBurst';
export default class UtilityProjectiles {
 constructor(match){this.match=match;this.entries=new Map();this.sequence=0;this.remote=false;this.geometry=new THREE.IcosahedronGeometry(.16,1);this.materials=Object.fromEntries(Object.entries({pearl:0x49bba8,egg:0xf1e9d1,wind:0xc2efff}).map(([kind,color])=>[kind,new THREE.MeshBasicMaterial({color})]));this.hit={valid:false};this.ray=new THREE.Ray();this.box=new THREE.Box3();this.point=new THREE.Vector3();}
 launch(i){
  const m=this.match,s=m.players[i.playerIndex],id=i.blocks[i.slot],def=THROWN_UTILITIES[id];
  if(!def||m.phase!=='active'||!s?.alive||m.clock<(s.utilityAt||0)||this.entries.size>=24||!i.store.consume(i.slot))return false;
  const p=s.body,cp=Math.cos(p.pitch);s.spawnGuard=0;s.utilityAt=m.clock+30;
  this.add({id:++this.sequence,source:i.playerIndex,kind:def.kind,gravity:def.gravity,x:p.x,y:p.y+p.eyeHeight,z:p.z,vx:-Math.sin(p.yaw)*cp*def.speed,vy:Math.sin(p.pitch)*def.speed,vz:-Math.cos(p.yaw)*cp*def.speed,due:m.clock+def.life});return true;
 }
 add(data){const mesh=new THREE.Mesh(this.geometry,this.materials[data.kind]);if(data.kind==='egg')mesh.scale.set(.8,1.1,.8);this.match.world.scene.add(mesh);mesh.position.set(data.x,data.y,data.z);this.entries.set(data.id,{...data,px:data.x,py:data.y,pz:data.z,receivedAt:performance.now(),mesh});}
 remove(a){this.match.world.scene.remove(a.mesh);this.entries.delete(a.id);}
 tick(){for(const a of this.entries.values()){
  a.px=a.x;a.py=a.y;a.pz=a.z;const dx=a.vx/60,dy=a.vy/60,dz=a.vz/60,length=Math.hypot(dx,dy,dz);let impact=null;
  if(a.kind==='wind')impact=arrowCollision(this,a,dx,dy,dz);
  else{voxelRaycast(this.match.world,a.x,a.y,a.z,dx/length,dy/length,dz/length,length,this.hit);if(this.hit.valid)impact={distance:this.hit.distance};}
  const fraction=impact?Math.max(0,impact.distance-.02)/length:1;a.x+=dx*fraction;a.y+=dy*fraction;a.z+=dz*fraction;a.vy-=a.gravity/60;
  if(a.kind==='egg')bridgeEggTrail(this.match,a);
  if(impact){if(a.kind==='pearl')pearlLanding(this.match,a,this.hit);if(a.kind==='wind')windBurst(this.match,a);this.remove(a);}
  else if(this.match.clock>=a.due||a.y< -25){if(a.kind==='pearl')this.match.players[a.source]?.interaction?.message('Your pearl faded before landing.');this.remove(a);}
 }}
 render(alpha){for(const a of this.entries.values()){
  const age=this.remote?Math.min(.15,(performance.now()-a.receivedAt)/1000):0;
  a.mesh.position.set(this.remote?a.x+a.vx*age:a.px+(a.x-a.px)*alpha,this.remote?a.y+a.vy*age-.5*a.gravity*age*age:a.py+(a.y-a.py)*alpha,this.remote?a.z+a.vz*age:a.pz+(a.z-a.pz)*alpha);a.mesh.rotation.y+=.04;
 }}
 snapshot(){return Array.from(this.entries.values(),({id,source,kind,gravity,x,y,z,vx,vy,vz,due})=>({id,source,kind,gravity,x,y,z,vx,vy,vz,due}));}
 sync(items=[]){this.remote=true;const ids=new Set(items.map(a=>a.id));for(const a of this.entries.values())if(!ids.has(a.id)){if(a.kind==='wind'&&this.match.clock<a.due)this.match.fireworks.burst(a.x,a.y,a.z);this.remove(a);}for(const data of items){if(!this.entries.has(data.id))this.add(data);Object.assign(this.entries.get(data.id),data,{receivedAt:performance.now()});}}
 dispose(){for(const a of this.entries.values())this.remove(a);this.geometry.dispose();Object.values(this.materials).forEach(material=>material.dispose());}
}