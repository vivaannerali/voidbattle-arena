import * as THREE from 'three';
import { CORNERS,TRI,SHADE,tileFor,blockHeight,blockX,blockZ } from '@/game/blocks';
import { DIAMOND_ISLANDS,EMERALD_ISLANDS } from '@/game/map';
import { atlasU,atlasV } from '@/game/atlasLayout';

export function cubeGeometry(tile,height=1){const g=new THREE.BoxGeometry(1,height,1);const a=g.attributes.uv;for(let i=0;i<a.count;i++){const u=a.getX(i),v=a.getY(i);a.setXY(i,atlasU(tile,.02+u*15.96),atlasV(tile,15.98-v*15.96));}return g;}
export function blockGeometry(id){const p=[],uv=[],colors=[];for(let f=0;f<6;f++){const tile=tileFor(id,f),co=CORNERS[f];for(let v=0;v<6;v++){const n=TRI[v];p.push(blockX(id,co[n*3])-.5,co[n*3+1]*blockHeight(id)-.5,blockZ(id,co[n*3+2])-.5);uv.push(atlasU(tile,n===1||n===2?15.98:.02),atlasV(tile,n<2?15.98:.02));colors.push(SHADE[f],SHADE[f],SHADE[f]);}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));return g;}
export function createScenery(scene,material){

 const parts=[];function part(tile,x,y,z,sx,sy,sz,rotation=0){const mesh=new THREE.Mesh(cubeGeometry(tile),material);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.rotation.y=rotation;scene.add(mesh);parts.push(mesh);return mesh;}
  const gems=[];for(const p of [...DIAMOND_ISLANDS.map(([x,z])=>[x,z,22]),...EMERALD_ISLANDS.map(([x,z])=>[x,z,23])]){const gem=part(p[2],p[0]+.5,19.1,p[1]+.5,.65,.65,.65);gems.push(gem);}
 return {gems,dispose(){for(const part of parts)part.geometry.dispose();}};
}
export function createTarget(scene,texture){const outline=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.005,1.005,1.005)),new THREE.LineBasicMaterial({color:0x121212}));const crack=new THREE.Mesh(cubeGeometry(32),new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.1,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));crack.scale.setScalar(1.003);scene.add(outline,crack);outline.visible=crack.visible=false;return {outline,crack,stage:-1};}
export function updateTarget(target,interaction){const h=interaction.hit;target.outline.visible=h.valid;target.crack.visible=h.valid&&interaction.progress>0;if(!h.valid)return;const height=blockHeight(h.id);target.outline.position.set(h.x+.5,h.y+height/2,h.z+.5);target.outline.scale.y=height;target.crack.position.copy(target.outline.position);target.crack.scale.y=height*1.003;const stage=Math.min(9,interaction.progress*10|0);if(stage!==target.stage){target.stage=stage;const a=target.crack.geometry.attributes.uv,tile=32+stage;for(let i=0;i<a.count;i++){const v=i%4;a.setXY(i,atlasU(tile,v===1||v===3?15.98:.02),atlasV(tile,v<2?.02:15.98));}a.needsUpdate=true;}}