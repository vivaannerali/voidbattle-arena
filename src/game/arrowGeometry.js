import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
export default function arrowGeometry(){
 const shaft=new THREE.CylinderGeometry(.014,.014,.8,4).rotateX(Math.PI/2),tip=new THREE.ConeGeometry(.055,.17,4).rotateX(Math.PI/2).translate(0,0,.48),feather=new THREE.BoxGeometry(.12,.018,.18).translate(0,0,-.32);
 const pieces=[shaft,tip,feather];
 pieces.forEach((g,i)=>{const color=new THREE.Color([0xa88358,0xd6e9ef,0xf6efe0][i]),values=[];for(let n=0;n<g.attributes.position.count;n++)values.push(color.r,color.g,color.b);g.setAttribute('color',new THREE.Float32BufferAttribute(values,3));});
 const geometry=mergeGeometries(pieces);pieces.forEach(g=>g.dispose());return geometry;
}