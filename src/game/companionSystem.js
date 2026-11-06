import * as THREE from 'three';
import { COMPANIONS } from '@/game/companionItems';
import CompanionModels from '@/game/companionModels';
import companionSpawn,{ companionBody } from '@/game/companionSpawn';
import companionAI from '@/game/companionAI';
export default class CompanionSystem {
 constructor(match){this.match=match;this.entries=new Map();this.sequence=0;this.remote=false;this.models=new CompanionModels(match.world.scene);this.box=new THREE.Box3();this.point=new THREE.Vector3();}
 spawn(i){return companionSpawn(this,i);}
 add(data){
  const body=companionBody(this.match.world,data.kind);body.spawn(data.x,data.y,data.z);body.yaw=data.yaw||0;
  const c={...data,def:COMPANIONS[data.kind],body,target:-1,attackAt:0,hurtUntil:0,lastDamage:0};c.control={sprint:false,down:key=>key==='KeyW'?!!c.move:key==='Space'?!!c.jump:false};
  this.entries.set(c.id,c);this.models.add(c);this.models.update(c,body.x,body.y,body.z);return c;
 }
 remove(c){this.entries.delete(c.id);this.models.remove(c);}
 tick(){for(const c of this.entries.values()){
  if(this.match.clock>=c.due||this.match.eliminated[c.team]){this.remove(c);continue;}
  companionAI(this.match,c);if(c.body.y< -20||c.health<=0)this.remove(c);
 }}
 hurt(id,source,raw,force=4,origin=null){
  const c=this.entries.get(id),m=this.match,s=m.players[source];if(!c||!s||m.phase!=='active'||m.allied(c.team,s.team))return false;
  const damage=Math.max(0,raw);if(c.hurtUntil>m.clock&&damage<=c.lastDamage)return false;
  c.health=Math.max(0,c.health-(c.hurtUntil>m.clock?damage-c.lastDamage:damage));c.lastDamage=damage;c.hurtUntil=m.clock+10;s.spawnGuard=0;
  const p=c.body,a=origin||s.body,dx=p.x-a.x,dz=p.z-a.z,length=Math.hypot(dx,dz)||1,weight=c.kind===95?.35:1;p.knockX+=dx/length*force*weight;p.knockZ+=dz/length*force*weight;p.vy=Math.max(p.vy,3*weight);p.grounded=false;
  if(!c.health)this.remove(c);return true;
 }
 rayHit(ray,limit,team){let result=null,closest=limit;for(const c of this.entries.values()){
  if(this.match.allied(team,c.team))continue;const p=c.body;this.box.min.set(p.x-.3,p.y,p.z-.3);this.box.max.set(p.x+.3,p.y+p.height,p.z+.3);
  if(ray.intersectBox(this.box,this.point)){const distance=ray.origin.distanceTo(this.point);if(distance<closest){closest=distance;result={id:c.id,distance};}}
 }return result;}
 overlaps(x,y,z){for(const c of this.entries.values())if(c.body.overlaps(x,y,z))return true;return false;}
 render(alpha){for(const c of this.entries.values()){
  const p=c.body,pos=c.mesh.position,x=this.remote?pos.x+(p.x-pos.x)*.35:p.px+(p.x-p.px)*alpha,y=this.remote?pos.y+(p.y-pos.y)*.35:p.py+(p.y-p.py)*alpha,z=this.remote?pos.z+(p.z-pos.z)*.35:p.pz+(p.z-p.pz)*alpha;c.flash=this.match.clock<c.hurtUntil;this.models.update(c,x,y,z);
 }}
 snapshot(){return Array.from(this.entries.values(),c=>({id:c.id,kind:c.kind,team:c.team,owner:c.owner,health:c.health,due:c.due,anchorX:c.anchorX,anchorZ:c.anchorZ,hurtUntil:c.hurtUntil,x:c.body.x,y:c.body.y,z:c.body.z,yaw:c.body.yaw}));}
 sync(items=[]){this.remote=true;const ids=new Set(items.map(c=>c.id));for(const c of this.entries.values())if(!ids.has(c.id))this.remove(c);for(const data of items){const c=this.entries.get(data.id)||this.add(data);Object.assign(c,data);c.body.x=data.x;c.body.y=data.y;c.body.z=data.z;c.body.yaw=data.yaw;}}
 dispose(){for(const c of this.entries.values())this.remove(c);this.models.dispose();}
}