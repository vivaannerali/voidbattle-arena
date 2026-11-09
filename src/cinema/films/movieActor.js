import * as THREE from 'three';
import playerSkins from '@/game/playerSkins';
import { bearGeometry } from '@/game/bearSkin';
import { signTexture } from '@/cinema/three/sceneKit';

export default function movieActor(name) {
  const skin = playerSkins(name), root = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ map: skin.texture, roughness: .75, emissive: name === 'Ephirisi' ? '#ffd45f' : '#000000', emissiveIntensity: .28 });
  const part = (parent, tile, x, y, z, w, h, d) => {
    const mesh = new THREE.Mesh(bearGeometry(tile), material);
    mesh.position.set(x, y, z); mesh.scale.set(w, h, d); parent.add(mesh); return mesh;
  };
  const head = part(root, 0, 0, 1.55, 0, .5, .5, .5);
  if (skin.bear) for (const side of [-1, 1]) part(root, 1, side * .19, 1.83, 0, .14, .15, .32);
  if (skin.hat) part(root, 7, 0, 1.83, 0, .58, .14, .58);
  part(root, 3, 0, .925, 0, .5, .65, .28);
  const limbs = [];
  for (const [x, y, tile, w, h] of [[-.36, 1.25, 5, .22, .65], [.36, 1.25, 5, .22, .65], [-.13, .6, 6, .23, .6], [.13, .6, 6, .23, .6]]) {
    const pivot = new THREE.Group(); pivot.position.set(x, y, 0); root.add(pivot);
    part(pivot, tile, 0, -h / 2, 0, w, h, .26); limbs.push(pivot);
  }
  const sword = new THREE.Mesh(new THREE.BoxGeometry(.1, .85, .07), new THREE.MeshStandardMaterial({ color: '#73e4e8', metalness: .7, roughness: .2 }));
  sword.position.set(0, -.45, -.4); sword.rotation.x = -Math.PI / 3; limbs[1].add(sword);
  const guard = new THREE.Mesh(new THREE.BoxGeometry(.32, .08, .1), new THREE.MeshStandardMaterial({ color: '#ffd45f' }));
  guard.position.y = -.22; sword.add(guard);
  const nameMap = signTexture(name.toUpperCase(), '', name === 'Ephirisi' ? '#ffd45f' : '#80adff');
  const tag = new THREE.Sprite(new THREE.SpriteMaterial({ map: nameMap, depthTest: true, transparent: true }));
  tag.position.y = 2.3; tag.scale.set(2, .5, 1); root.add(tag);
  if (name === 'Ephirisi') { const glow = new THREE.PointLight('#ffd45f', 8, 5); glow.position.y = 1; root.add(glow); }
  return { root, head, limbs, update(time, walk = 0, attack = 0) {
    limbs.forEach((limb, i) => { limb.rotation.x = Math.sin(time * 7 + (i % 2) * Math.PI) * walk * .65; });
    limbs[1].rotation.x -= attack * 1.8; head.rotation.x = Math.sin(time) * .025;
  }, dispose() { nameMap.dispose(); } };
}