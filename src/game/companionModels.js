import * as THREE from 'three';
import { TEAM_COLORS } from '@/game/blocks';
function geometry(kind,team){
 const positions=[],colors=[];
 const box=(x,y,z,w,h,d,color)=>{const g=new THREE.BoxGeometry(w,h,d).toNonIndexed();g.translate(x,y,z);positions.push(...g.attributes.position.array);const c=new THREE.Color(color);for(let n=0;n<g.attributes.position.count;n++)colors.push(c.r,c.g,c.b);g.dispose();};
 if(kind===94){
  for(let n=0;n<5;n++)box(0,.16,(-2+n)*.15,.48-Math.abs(n-2)*.08,.24,.18,n%2?0x8b999d:0xb7c5c8);
  for(let n=0;n<3;n++)for(const side of [-1,1])box(side*.25,.06,(n-1)*.2,.16,.08,.06,0x4a555a);
  box(0,.3,-.1,.28,.08,.25,TEAM_COLORS[team]);for(const side of [-1,1])box(side*.12,.22,-.405,.07,.05,.02,0x232c30);
 }else{
  box(0,1.25,0,.6,.85,.42,0xd5d9ca);box(0,2.03,0,.48,.62,.45,0xe6e8da);box(0,1.52,-.23,.52,.18,.04,TEAM_COLORS[team]);
  for(const side of [-1,1]){box(side*.17,.4,0,.27,.8,.3,0xb4bfad);box(side*.43,1.17,0,.22,1.1,.3,0xd0d6c4);box(side*.11,2.13,-.237,.07,.055,.025,0xa5483e);}
  box(.14,1.1,-.22,.08,.5,.03,0x647e4c);box(0,1.97,-.27,.1,.18,.13,0xa8b49a);
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.computeBoundingSphere();return g;
}
export default class CompanionModels {
 constructor(scene){this.scene=scene;this.geometries=new Map();}
 add(c){
  const key=c.kind+':'+c.team;if(!this.geometries.has(key))this.geometries.set(key,geometry(c.kind,c.team));
  c.mesh=new THREE.Mesh(this.geometries.get(key),new THREE.MeshBasicMaterial({vertexColors:true}));this.scene.add(c.mesh);
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=32;c.context=canvas.getContext('2d');c.labelTexture=new THREE.CanvasTexture(canvas);c.labelTexture.magFilter=THREE.NearestFilter;c.labelTexture.minFilter=THREE.NearestFilter;c.labelTexture.colorSpace=THREE.SRGBColorSpace;
  c.label=new THREE.Sprite(new THREE.SpriteMaterial({map:c.labelTexture,depthWrite:false}));c.label.scale.set(2.6,.325,1);this.scene.add(c.label);
 }
 update(c,x,y,z){
  c.mesh.position.set(x,y,z);c.mesh.rotation.y=c.body.yaw;c.mesh.material.color.setHex(c.flash?0xff9999:0xffffff);c.label.position.set(x,y+c.def.height+.35,z);
  if(c.labelHealth===c.health)return;c.labelHealth=c.health;const ctx=c.context;ctx.clearRect(0,0,256,32);ctx.fillStyle='#10151dcc';ctx.fillRect(0,0,256,32);ctx.font='bold 17px monospace';ctx.textAlign='center';ctx.fillStyle='#'+TEAM_COLORS[c.team].toString(16).padStart(6,'0');ctx.fillText(c.def.name+' '+Math.ceil(c.health)+' HP',128,22);c.labelTexture.needsUpdate=true;
 }
 remove(c){this.scene.remove(c.mesh,c.label);c.mesh.material.dispose();c.labelTexture.dispose();c.label.material.dispose();}
 dispose(){for(const g of this.geometries.values())g.dispose();this.geometries.clear();}
}