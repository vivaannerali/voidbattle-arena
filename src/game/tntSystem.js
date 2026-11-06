import * as THREE from 'three';
import { cubeGeometry } from '@/game/visuals';
import { B } from '@/game/blocks';
import canPlaceBlock from '@/game/blockPlacement';
import tntBlast from '@/game/tntBlast';
export const TNT_ID=74;
export default class TntSystem {
 constructor(match){this.match=match;this.entries=new Map();this.sequence=0;this.geometry=cubeGeometry(124);this.material=match.world.material.clone();}
 prime(source,x,y,z){const m=this.match,s=m.players[source];if(m.phase!=='active'||!s?.alive||!s.inventory.total(TNT_ID)||this.entries.size>=16||!canPlaceBlock(m.world,s.body,m,x,y,z,B.RED)||!m.world.get(x,y-1,z)||Math.hypot(s.body.x-x-.5,s.body.y+s.body.eyeHeight-y-.45,s.body.z-z-.5)>4.5||!m.lineClear(s.body.x,s.body.y+s.body.eyeHeight,s.body.z,x+.5,y+.45,z+.5))return false;
  for(const b of this.entries.values())if(Math.hypot(b.x-x-.5,b.y-y-.45,b.z-z-.5)<1)return false;
  if(!s.inventory.spend(TNT_ID,1))return false;s.spawnGuard=0;s.swingTicks=12;this.add({id:++this.sequence,x:x+.5,y:y+.45,z:z+.5,source,due:m.clock+180});return true;
 }
 add(data){const mesh=new THREE.Mesh(this.geometry,this.material);mesh.position.set(data.x,data.y,data.z);mesh.scale.setScalar(.9);this.match.world.scene.add(mesh);this.entries.set(data.id,{...data,mesh});}
 remove(bomb){this.match.world.scene.remove(bomb.mesh);this.entries.delete(bomb.id);}
 tick(){for(const b of this.entries.values()){b.mesh.scale.setScalar(this.match.clock%24<12?.9:.96);if(this.match.clock>=b.due){this.remove(b);tntBlast(this.match,b);}}}
 snapshot(){return Array.from(this.entries.values(),({id,x,y,z,source,due})=>({id,x,y,z,source,due}));}
 sync(items=[]){const ids=new Set(items.map(b=>b.id));for(const b of this.entries.values())if(!ids.has(b.id)){if(this.match.clock>=b.due)this.match.fireworks.burst(b.x,b.y,b.z);this.remove(b);}for(const b of items){if(!this.entries.has(b.id))this.add(b);this.entries.get(b.id).mesh.scale.setScalar(this.match.clock%24<12?.9:.96);}}
 dispose(){for(const b of this.entries.values())this.remove(b);this.geometry.dispose();this.material.dispose();}
}