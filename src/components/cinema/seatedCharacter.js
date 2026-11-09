import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { bearGeometry } from '@/game/bearSkin';

export default function seatedCharacter(skin, firstPerson = false) {
  const parts = [];
  const box = (tile, x, y, z, w, h, d, angle = 0) => {
    const g = bearGeometry(tile);
    g.scale(w, h, d); g.rotateX(angle); g.translate(x, y, z); parts.push(g);
  };
  box(3, 0, .88, 0, .5, .65, .28);
  for (const side of [-1, 1]) {
    box(6, side * .13, .52, -.3, .23, .6, .26, Math.PI / 2);
    box(6, side * .13, .27, -.58, .23, .48, .26);
    box(5, side * .36, 1.0, -.38, .22, .65, .25, Math.PI / 2);
    box(5, side * .36, .98, -.76, .22, .22, .25);
  }
  if (!firstPerson) {
    box(0, 0, 1.45, 0, .5, .5, .5);
    if (skin.bear) for (const side of [-1, 1]) box(1, side * .19, 1.73, 0, .14, .15, .32);
    if (skin.hat) box(7, 0, 1.72, 0, .58, .14, .58);
  }
  const geometry = mergeGeometries(parts);
  parts.forEach(part => part.dispose());
  return geometry;
}