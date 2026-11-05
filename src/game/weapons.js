import * as THREE from 'three';
import { CORNERS,TRI,SHADE } from '@/game/blocks';
import { SWORDS } from '@/game/equipment';

export function swordGeometry(tier){
 const positions=[],uv=[],colors=[],color=new THREE.Color();
 function box(x,y,z,w,h,d,tint){color.setHex(tint);for(let f=0;f<6;f++)for(let v=0;v<6;v++){const n=TRI[v],co=CORNERS[f];positions.push(x+(co[n*3]-.5)*w,y+(co[n*3+1]-.5)*h,z+(co[n*3+2]-.5)*d);uv.push((.1+(n%2)*.8)/8,1-(1+.1+(n<2?.8:0))/16);colors.push(color.r*SHADE[f],color.g*SHADE[f],color.b*SHADE[f]);}}
 box(0,-.40,0,.105,.36,.09,0x765334);box(0,-.22,0,.4,.1,.10,SWORDS[tier].color);box(0,.18,0,.17,.75,.075,SWORDS[tier].color);box(0,.60,0,.11,.11,.075,SWORDS[tier].color);box(0,-.61,0,.15,.08,.1,0x695444);
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));return geometry;
}