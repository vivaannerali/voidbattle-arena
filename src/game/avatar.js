import * as THREE from 'three';
import { cubeGeometry } from '@/game/visuals';
import { TEAM_COLORS } from '@/game/blocks';
import { swordGeometry } from '@/game/weapons';
import botNameTag from '@/game/botNameTag';

// All parts reuse the game's atlas. Animation only mutates existing transforms.
export default class Avatar {
 constructor(scene,texture,team,name='Bot'){this.team=team;this.armourTier=-1;this.root=new THREE.Group();scene.add(this.root);this.meshes=[];this.geometries=[];this.materials=[];this.flash=false;
  const skin=this.material(texture,0xffffff),shirt=this.material(texture,TEAM_COLORS[team]),trousers=this.material(texture,0x65748a);this.shirt=shirt;this.trousers=trousers;
  this.head=this.part(this.root,19,skin,0,1.55,0,.5,.5,.5);
  this.part(this.root,8,shirt,0,.925,0,.50,.65,.28);
  this.leftArm=new THREE.Group();this.leftArm.position.set(-.36,1.25,0);this.root.add(this.leftArm);this.part(this.leftArm,8,shirt,0,-.325,0,.22,.65,.25);
  this.rightArm=new THREE.Group();this.rightArm.position.set(.36,1.25,0);this.root.add(this.rightArm);this.part(this.rightArm,8,shirt,0,-.325,0,.22,.65,.25);
  this.leftLeg=new THREE.Group();this.leftLeg.position.set(-.13,.6,0);this.root.add(this.leftLeg);this.part(this.leftLeg,21,trousers,0,-.3,0,.23,.6,.26);
  this.rightLeg=new THREE.Group();this.rightLeg.position.set(.13,.6,0);this.root.add(this.rightLeg);this.part(this.rightLeg,21,trousers,0,-.3,0,.23,.6,.26);
  const weaponMaterial=new THREE.MeshBasicMaterial({map:texture,vertexColors:true,alphaTest:.1});this.materials.push(weaponMaterial);this.swordGeometries=Array.from({length:4},(_,tier)=>swordGeometry(tier));this.geometries.push(...this.swordGeometries);const sword=new THREE.Mesh(this.swordGeometries[0],weaponMaterial);this.sword=sword;sword.scale.setScalar(.55);sword.rotation.x=-Math.PI/2;sword.position.set(0,-.60,-.25);this.rightArm.add(sword);
  const tag=botNameTag(name,team);this.geometries.push(tag.geometry);this.materials.push(tag.material);this.tag=tag.mesh;this.tagTexture=tag.texture;scene.add(this.tag);
 }
 material(texture,color){const m=new THREE.MeshBasicMaterial({map:texture,color,alphaTest:.1});m.userData.base=color;this.materials.push(m);return m;}
 part(parent,tile,material,x,y,z,w,h,d){const g=cubeGeometry(tile);this.geometries.push(g);const m=new THREE.Mesh(g,material);m.position.set(x,y,z);m.scale.set(w,h,d);parent.add(m);this.meshes.push(m);return m;}
 update(state,camera,alpha,local){const p=state.body;this.root.visible=state.alive&&!local&&!(state.effects.invisibilityTicks>0&&state.effects.revealTicks<=0);this.tag.visible=this.root.visible;this.tag.material.color.setHex(state.effects.revealTicks>0?0xff8888:0xffffff);if(!this.root.visible)return;this.sword.geometry=this.swordGeometries[Math.max(0,Math.min(3,state.sword-32))];if(this.armourTier!==state.gear.armourTier){this.armourTier=state.gear.armourTier;const color=this.armourTier>=2?[0,0,0xa1abb8,0xdce3e9,0x62dcd6][this.armourTier]:TEAM_COLORS[this.team];this.shirt.userData.base=color;this.shirt.color.setHex(color);this.trousers.userData.base=this.armourTier>=2?color:0x65748a;this.trousers.color.setHex(this.trousers.userData.base);}const x=p.px+(p.x-p.px)*alpha,y=p.py+(p.y-p.py)*alpha,z=p.pz+(p.z-p.pz)*alpha;this.root.position.set(x,y,z);this.root.scale.y=p.height/1.8;this.root.rotation.y=p.yaw;this.head.rotation.x=-p.pitch;const moving=Math.abs(p.vx)+Math.abs(p.vz)+Math.abs(p.knockX)+Math.abs(p.knockZ)>.05,walk=moving?Math.sin(p.distance*8)*.65:0,attack=state.swingTicks>0?Math.sin((1-state.swingTicks/12)*Math.PI):0;this.leftLeg.rotation.x=walk;this.rightLeg.rotation.x=-walk;this.leftArm.rotation.x=-walk;this.rightArm.rotation.x=walk-attack*1.7;this.rightArm.rotation.z=-attack*.3;this.tag.position.set(x,y+p.height+.38,z);this.tag.quaternion.copy(camera.quaternion);const flash=state.hitFlash>0;if(flash!==this.flash){this.flash=flash;for(let i=0;i<this.materials.length;i++){const m=this.materials[i];if(m.userData.base!==undefined)m.color.setHex(flash?0xff4d4d:m.userData.base);}}}
 dispose(scene){this.tagTexture.dispose();scene.remove(this.root,this.tag);for(const g of this.geometries)g.dispose();for(const m of this.materials)m.dispose();}
}