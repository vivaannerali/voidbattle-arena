import * as THREE from 'three';
import { ARROW,BOWS } from '@/game/rangedItems';
import arrowGeometry from '@/game/arrowGeometry';
import arrowCollision from '@/game/arrowCollision';
import arrowDamage from '@/game/arrowDamage';
export default class ArrowSystem {
 constructor(match){this.match=match;this.entries=new Map();this.sequence=0;this.remote=false;this.geometry=arrowGeometry();this.material=new THREE.MeshBasicMaterial({vertexColors:true});this.ray=new THREE.Ray();this.box=new THREE.Box3();this.point=new THREE.Vector3();this.hit={valid:false};}
 launch(source,id,charge){
  const m=this.match,s=m.players[source],bow=BOWS[id];if(!bow||m.phase!=='active'||!s?.alive||s.inventory.total(id)<1||m.clock<(s.nextArrowAt||0)||this.entries.size>=64||!s.inventory.spend(ARROW,1))return false;
  const p=s.body,power=Math.max(.1,Math.min(1,charge)),speed=12+power*38,cp=Math.cos(p.pitch);
  s.nextArrowAt=m.clock+(bow.automatic?6:12);s.spawnGuard=0;s.swingTicks=6;
  this.add({id:++this.sequence,source,x:p.x,y:p.y+p.eyeHeight,z:p.z,vx:-Math.sin(p.yaw)*cp*speed,vy:Math.sin(p.pitch)*speed,vz:-Math.cos(p.yaw)*cp*speed,damage:2+(bow.damage-2)*power,punch:bow.punch,due:m.clock+300});
  if(bow.automatic){s.machineBowUses=(s.machineBowUses||0)+1;if(s.machineBowUses>=bow.durability){s.inventory.spend(id,1);s.interaction?.message('Your Machine Gun Bow broke.');}}
  return true;
 }
 add(data){const mesh=new THREE.Mesh(this.geometry,this.material);this.match.world.scene.add(mesh);this.entries.set(data.id,{...data,px:data.x,py:data.y,pz:data.z,receivedAt:performance.now(),mesh});mesh.position.set(data.x,data.y,data.z);}
 remove(a){this.match.world.scene.remove(a.mesh);this.entries.delete(a.id);}
 tick(){
  for(const s of this.match.players)if(!s.alive||!s.interaction?.input.active)s.bowTicks=0;
  for(const a of this.entries.values()){
   a.px=a.x;a.py=a.y;a.pz=a.z;const dx=a.vx/60,dy=a.vy/60,dz=a.vz/60,hit=arrowCollision(this,a,dx,dy,dz);
   if(hit){if(hit.target>=0)arrowDamage(this.match,a,hit.target);this.remove(a);continue;}
   a.x+=dx;a.y+=dy;a.z+=dz;a.vy-=16/60;
   if(this.match.clock>=a.due||a.y< -25)this.remove(a);
  }
 }
 render(alpha){for(const a of this.entries.values()){
  const age=this.remote?Math.min(.15,(performance.now()-a.receivedAt)/1000):0;
  a.mesh.position.set(this.remote?a.x+a.vx*age:a.px+(a.x-a.px)*alpha,this.remote?a.y+a.vy*age-8*age*age:a.py+(a.y-a.py)*alpha,this.remote?a.z+a.vz*age:a.pz+(a.z-a.pz)*alpha);
  a.mesh.lookAt(a.mesh.position.x+a.vx,a.mesh.position.y+a.vy,a.mesh.position.z+a.vz);
 }}
 snapshot(){return Array.from(this.entries.values(),({id,source,x,y,z,vx,vy,vz,due})=>({id,source,x,y,z,vx,vy,vz,due}));}
 sync(items=[]){this.remote=true;const ids=new Set(items.map(a=>a.id));for(const a of this.entries.values())if(!ids.has(a.id))this.remove(a);for(const data of items){if(!this.entries.has(data.id))this.add(data);Object.assign(this.entries.get(data.id),data,{receivedAt:performance.now()});}}
 dispose(){for(const a of this.entries.values())this.remove(a);this.geometry.dispose();this.material.dispose();}
}