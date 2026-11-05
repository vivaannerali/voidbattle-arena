import * as THREE from 'three';
import { itemTile } from '@/game/equipment';

export default function pixelItemGeometry(id){const tile=itemTile(id),g=new THREE.PlaneGeometry(.95,.95),uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,(tile%8+.002+uv.getX(i)*.996)/8,1-(Math.floor(tile/8)+.998-uv.getY(i)*.996)/16);g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(12).fill(1),3));return g;}