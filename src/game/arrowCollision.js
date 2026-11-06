import voxelRaycast from '@/game/voxelRaycast';
export default function arrowCollision(system,arrow,dx,dy,dz){
 const m=system.match,length=Math.hypot(dx,dy,dz);if(length<1e-8)return null;
 const {ray,box,point,hit}=system;ray.origin.set(arrow.x,arrow.y,arrow.z);ray.direction.set(dx/length,dy/length,dz/length);
 voxelRaycast(m.world,arrow.x,arrow.y,arrow.z,ray.direction.x,ray.direction.y,ray.direction.z,length,hit);
 let distance=hit.valid?hit.distance:length+.001,target=-1;
 for(let i=0;i<m.players.length;i++){
  const s=m.players[i];if(i===arrow.source||!s.alive||m.allied(s.team,m.players[arrow.source].team))continue;
  const p=s.body;box.min.set(p.x-.32,p.y,p.z-.32);box.max.set(p.x+.32,p.y+p.height,p.z+.32);
  if(ray.intersectBox(box,point)){const d=ray.origin.distanceTo(point);if(d<=length&&d<distance){distance=d;target=i;}}
 }
 const companion=m.companions?.rayHit(ray,distance,m.players[arrow.source].team);if(companion&&companion.distance<=length)return {target:-1,companion:companion.id,distance:companion.distance};
 return distance<=length?{target,distance}:null;
}