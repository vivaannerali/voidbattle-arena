import * as THREE from 'three';
import { bearGeometry } from '@/game/bearSkin';
import playerSkins from '@/game/playerSkins';
import { swordGeometry } from '@/game/weapons';
import pixelItemGeometry from '@/game/pixelItemGeometry';
import botNameTag from '@/game/botNameTag';
import ephirisiGlow from '@/game/ephirisiGlow';
import { addEnchantGlint,updateEnchantGlint } from '@/game/enchantGlint';

// All parts reuse the game's atlas. Animation only mutates existing transforms.
export default class Avatar {
 constructor(scene,texture,team,name='Bot'){this.skin=playerSkins(name);this.ephirisi=name.toLowerCase()==='ephirisi';this.team=team;this.armourTier=-1;this.root=new THREE.Group();scene.add(this.root);this.meshes=[];this.geometries=[];this.materials=[];this.flash=false;
  const skin=this.material(texture,0xffffff),shirt=this.material(texture,0xffffff),trousers=this.material(texture,0xffffff);this.shirt=addEnchantGlint(shirt);this.trousers=addEnchantGlint(trousers);
  this.head=this.part(this.root,0,skin,0,1.55,0,.5,.5,.5);if(this.skin.bear){this.part(this.head,1,skin,-.34,.48,0,.28,.30,.65);this.part(this.head,1,skin,.34,.48,0,.28,.30,.65);}if(this.skin.hat){this.part(this.head,7,skin,0,.58,0,1.04,.4,1.04);this.part(this.head,7,skin,0,.39,0,1.15,.12,1.15);}
  this.part(this.root,3,shirt,0,.925,0,.50,.65,.28);
  this.leftArm=new THREE.Group();this.leftArm.position.set(-.36,1.25,0);this.root.add(this.leftArm);this.part(this.leftArm,5,shirt,0,-.325,0,.22,.65,.25);
  this.rightArm=new THREE.Group();this.rightArm.position.set(.36,1.25,0);this.root.add(this.rightArm);this.part(this.rightArm,5,shirt,0,-.325,0,.22,.65,.25);
  this.leftLeg=new THREE.Group();this.leftLeg.position.set(-.13,.6,0);this.root.add(this.leftLeg);this.part(this.leftLeg,6,trousers,0,-.3,0,.23,.6,.26);
  this.rightLeg=new THREE.Group();this.rightLeg.position.set(.13,.6,0);this.root.add(this.rightLeg);this.part(this.rightLeg,6,trousers,0,-.3,0,.23,.6,.26);
  const weaponMaterial=addEnchantGlint(new THREE.MeshBasicMaterial({map:texture,vertexColors:true,alphaTest:.1}));this.materials.push(weaponMaterial);this.swordGeometries=Array.from({length:4},(_,tier)=>swordGeometry(tier));this.toolGeometries=Object.fromEntries([36,50,51,52,53,54,55,56,57,58,74].map(id=>[id,pixelItemGeometry(id)]));this.geometries.push(...this.swordGeometries,...Object.values(this.toolGeometries));const sword=new THREE.Mesh(this.swordGeometries[0],weaponMaterial);this.sword=sword;sword.scale.setScalar(.55);sword.rotation.x=-Math.PI/2;sword.position.set(0,-.60,-.25);this.rightArm.add(sword);
  const tag=botNameTag(name,team,texture);this.geometries.push(tag.geometry);this.materials.push(tag.material);this.tag=tag.mesh;scene.add(this.tag);
 }
 material(texture,color){const m=new THREE.MeshBasicMaterial({map:this.skin.texture,color,alphaTest:.1});m.userData.base=color;this.materials.push(m);return m;}
 part(parent,tile,material,x,y,z,w,h,d){const g=bearGeometry(tile);this.geometries.push(g);const m=new THREE.Mesh(g,material);m.position.set(x,y,z);m.scale.set(w,h,d);parent.add(m);this.meshes.push(m);return m;}
 update(state,camera,alpha,local,upgrades){const p=state.body;this.root.visible=state.alive&&!local&&!(state.effects.invisibilityTicks>0&&state.effects.revealTicks<=0);this.tag.visible=this.root.visible;this.tag.material.color.setHex(state.effects.revealTicks>0?0xff8888:0xffffff);if(!this.root.visible)return;const time=performance.now()*.001;updateEnchantGlint(this.shirt,time,upgrades?.protection>0);updateEnchantGlint(this.trousers,time,upgrades?.protection>0);updateEnchantGlint(this.sword.material,time,upgrades?.sharpness>0);this.sword.geometry=this.toolGeometries[state.heldTool]||this.swordGeometries[Math.max(0,Math.min(3,state.sword-32))];this.armourTier=state.gear.armourTier;const x=p.px+(p.x-p.px)*alpha,y=p.py+(p.y-p.py)*alpha,z=p.pz+(p.z-p.pz)*alpha;this.root.position.set(x,y,z);this.root.scale.y=p.height/1.8;this.root.rotation.y=p.yaw;this.head.rotation.x=-p.pitch;const moving=Math.abs(p.vx)+Math.abs(p.vz)+Math.abs(p.knockX)+Math.abs(p.knockZ)>.05,walk=moving?Math.sin(p.distance*8)*.65:0,attack=state.swingTicks>0?Math.sin((1-state.swingTicks/12)*Math.PI):0;this.leftLeg.rotation.x=walk;this.rightLeg.rotation.x=-walk;this.leftArm.rotation.x=-walk;this.rightArm.rotation.x=walk-attack*1.7;this.rightArm.rotation.z=-attack*.3;this.tag.position.set(x,y+p.height+.38,z);this.tag.quaternion.copy(camera.quaternion);const flash=state.hitFlash>0;if(flash!==this.flash){this.flash=flash;for(let i=0;i<this.materials.length;i++){const m=this.materials[i];if(m.userData.base!==undefined)m.color.setHex(flash?0xff4d4d:m.userData.base);}}ephirisiGlow(this,time);}
 dispose(scene){scene.remove(this.root,this.tag);for(const g of this.geometries)g.dispose();for(const m of this.materials)m.dispose();}
}