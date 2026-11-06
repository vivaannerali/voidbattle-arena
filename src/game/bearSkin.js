import * as THREE from 'three';
let texture;
export default function bearSkin(){
 if(texture)return texture;
 const canvas=document.createElement('canvas');canvas.width=128;canvas.height=16;
 const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
 const rect=(tile,color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(tile*16+x,y,w,h);};
 for(let t=0;t<8;t++){
  rect(t,'#b9e8e8',0,0,16,16);rect(t,'#a4d2dc',0,0,2,16);rect(t,'#cff3ec',2,0,12,2);
  rect(t,'#a8d7dd',14,2,2,14);rect(t,'#acd8de',2,14,12,2);rect(t,'#c4edeb',3,3,3,10);
 }
 // Bear face, with a white muzzle and dark navy eyes and nose.
 rect(0,'#effcf5',5,9,6,5);rect(0,'#effcf5',3,10,10,3);
 rect(0,'#101f48',3,7,2,2);rect(0,'#101f48',11,7,2,2);rect(0,'#101f48',6,10,4,2);
 rect(0,'#dff6ef',10,2,2,2);
 // White belly emblem on the front of the aqua onesie.
 rect(3,'#a8d6dd',3,2,10,13);rect(3,'#d5efea',4,3,8,10);
 rect(3,'#f8fff7',5,4,6,8);rect(3,'#babbdc',6,6,1,4);rect(3,'#babbdc',9,6,1,4);
 rect(3,'#effbf2',6,11,4,3);
 // Hood seam, sleeve shading, and pale cuffs and feet.
 rect(2,'#aed9de',7,1,2,14);rect(4,'#a6d2db',7,2,2,13);
 rect(5,'#96c5d3',4,4,2,7);rect(5,'#cef0eb',2,13,12,2);
 rect(6,'#9fcbd6',7,1,2,13);rect(6,'#d0efeb',2,13,12,2);
 rect(7,'#d5efea',2,2,12,12);
 texture=new THREE.CanvasTexture(canvas);texture.magFilter=THREE.NearestFilter;texture.minFilter=THREE.NearestFilter;
 texture.generateMipmaps=false;texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
export function bearGeometry(tile){
 const geometry=new THREE.BoxGeometry(1,1,1),uv=geometry.attributes.uv;
 const faces=tile===0?[1,1,1,1,2,0]:tile===3?[5,5,1,1,4,3]:[tile,tile,7,7,tile,tile];
 for(let face=0;face<6;face++)for(let v=0;v<4;v++){
  const i=face*4+v;uv.setXY(i,(faces[face]*16+.02+uv.getX(i)*15.96)/128,.00125+uv.getY(i)*.9975);
 }
 return geometry;
}