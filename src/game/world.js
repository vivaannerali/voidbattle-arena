import * as THREE from 'three';
import { B, DIRS, CORNERS, TRI, SHADE, tileFor, blockHeight } from '@/game/blocks';

// One draw-call per 16³ chunk. Dense typed voxel data, numeric chunk keys.
// Edits patch only affected faces in-place, including a boundary face in its
// existing neighbour buffer; no world rebuild and no neighbour remeshing.
export default class World {
 constructor(scene,material){this.scene=scene;this.material=material;this.chunks=new Array(4096).fill(null);this.ready=false;this.meshCount=0;this.dirty=new Int16Array(12288);this.dirtyCount=0;
  // Reserve the finite world's voxel storage up front. Crossing a chunk edge
  // while bridging never creates an object or typed array inside a tick.
  for(let x=-256;x<256;x+=16)for(let y=0;y<64;y+=16)for(let z=-256;z<256;z+=16)this.chunk(x,y,z,true);
  // Buffer growth / meshing happens outside the simulation and render loop.
  this.meshTimer=setInterval(()=>this.flush(),16);
 }
 key(x,y,z){return (((x>>4)+16)*4+(y>>4))*32+(z>>4)+16;}
 valid(x,y,z){return x>=-256&&x<256&&z>=-256&&z<256&&y>=0&&y<64;}
 chunk(x,y,z,create=false){if(!this.valid(x,y,z))return null;const key=this.key(x,y,z);let c=this.chunks[key];if(!c&&create){c={x:(x>>4)*16,y:(y>>4)*16,z:(z>>4)*16,data:new Uint8Array(4096),placed:new Uint8Array(4096),nonempty:0,mesh:null,faces:0,capacity:0,slots:null,reverse:null};this.chunks[key]=c;}return c;}
 index(x,y,z){return ((y&15)*16+(z&15))*16+(x&15);}
 get(x,y,z){const c=this.chunk(x,y,z);return c?c.data[this.index(x,y,z)]:0;}
 editable(x,y,z){const c=this.chunk(x,y,z);return c&&c.placed[this.index(x,y,z)]===1;}
 set(x,y,z,id,placed=false){const c=this.chunk(x,y,z);if(!c)return;const i=this.index(x,y,z);if(!c.data[i]&&id)c.nonempty++;else if(c.data[i]&&!id)c.nonempty--;c.data[i]=id;c.placed[i]=placed?1:0;if(this.ready&&this.dirtyCount<4096){const q=this.dirtyCount++*3;this.dirty[q]=x;this.dirty[q+1]=y;this.dirty[q+2]=z;}}
 flush(){for(let j=0;j<this.dirtyCount;j++){const q=j*3,x=this.dirty[q],y=this.dirty[q+1],z=this.dirty[q+2],c=this.chunk(x,y,z);if(!c.mesh)this.build(c);else this.refresh(c,x,y,z);for(let f=0;f<6;f++){const d=DIRS[f],nx=x+d[0],ny=y+d[1],nz=z+d[2],n=this.chunk(nx,ny,nz);if(n?.mesh)this.refresh(n,nx,ny,nz);}}this.dirtyCount=0;}
 visible(x,y,z,id,f){const d=DIRS[f],n=this.get(x+d[0],y+d[1],z+d[2]);if(!n)return true;if(n===B.GLASS)return id!==B.GLASS;return blockHeight(n)<blockHeight(id)||(f===2&&blockHeight(id)<1);}
 buildAll(){for(let k=0;k<4096;k++)if(this.chunks[k]?.nonempty)this.build(this.chunks[k]);this.ready=true;}
 build(c){let count=0;for(let i=0;i<4096;i++){const id=c.data[i];if(!id)continue;const x=c.x+(i&15),y=c.y+(i>>8),z=c.z+((i>>4)&15);for(let f=0;f<6;f++)if(this.visible(x,y,z,id,f))count++;}this.allocate(c,Math.max(2048,count+2048));c.slots=new Int32Array(24576);c.slots.fill(-1);c.faces=0;for(let i=0;i<4096;i++){if(!c.data[i])continue;this.refresh(c,c.x+(i&15),c.y+(i>>8),c.z+((i>>4)&15));}c.mesh.geometry.computeBoundingSphere();}
 allocate(c,capacity){const old=c.mesh?.geometry,g=new THREE.BufferGeometry();c.capacity=capacity;c.reverse=new Int32Array(capacity);for(const [name,size] of [['position',18],['color',18],['uv',12]]){const a=new Float32Array(capacity*size);if(old)a.set(old.attributes[name].array.subarray(0,c.faces*size));g.setAttribute(name,new THREE.BufferAttribute(a,name==='uv'?2:3).setUsage(THREE.DynamicDrawUsage));}if(c.mesh){c.mesh.geometry=g;old.dispose();}else{c.mesh=new THREE.Mesh(g,this.material);c.mesh.frustumCulled=false;this.scene.add(c.mesh);this.meshCount++;}if(c.slots)for(let i=0;i<24576;i++)if(c.slots[i]>=0)c.reverse[c.slots[i]]=i;}
 removeFace(c,key){const slot=c.slots[key];if(slot<0)return;const last=--c.faces;if(slot!==last){for(const name of ['position','color','uv']){const a=c.mesh.geometry.attributes[name],n=name==='uv'?12:18;a.array.copyWithin(slot*n,last*n,(last+1)*n);}const moved=c.reverse[last];c.slots[moved]=slot;c.reverse[slot]=moved;}c.slots[key]=-1;}
 refresh(c,x,y,z){const i=this.index(x,y,z),id=c.data[i];for(let f=0;f<6;f++){const key=i*6+f;if(!id||!this.visible(x,y,z,id,f)){this.removeFace(c,key);continue;}let slot=c.slots[key];if(slot<0){if(c.faces===c.capacity)this.allocate(c,c.capacity*2);slot=c.faces++;c.slots[key]=slot;c.reverse[slot]=key;}this.writeFace(c,slot,x,y,z,id,f);}const g=c.mesh.geometry;g.setDrawRange(0,c.faces*6);g.attributes.position.needsUpdate=true;g.attributes.color.needsUpdate=true;g.attributes.uv.needsUpdate=true;}
 writeFace(c,slot,x,y,z,id,f){const g=c.mesh.geometry,p=g.attributes.position.array,col=g.attributes.color.array,uv=g.attributes.uv.array,co=CORNERS[f],tile=tileFor(id,f),tx=tile%8,ty=tile/8|0,h=blockHeight(id),shade=SHADE[f];for(let v=0;v<6;v++){const n=TRI[v],a=slot*18+v*3,u=slot*12+v*2;p[a]=x+co[n*3];p[a+1]=y+co[n*3+1]*h;p[a+2]=z+co[n*3+2];col[a]=col[a+1]=col[a+2]=shade;uv[u]=(tx+(n===1||n===2?.998:.002))/8;uv[u+1]=1-(ty+(n<2?.998:.002))/8;}}
 dispose(){clearInterval(this.meshTimer);for(let i=0;i<4096;i++)if(this.chunks[i]?.mesh)this.chunks[i].mesh.geometry.dispose();}
}