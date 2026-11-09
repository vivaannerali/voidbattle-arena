import * as THREE from 'three';

const SHOTS = {
  arrival: [[-22, 13, 23], [18, 9, 20], [0, 0, 0]],
  forge: [[-15, 2.8, 3], [-10, 2, 2], [-12, 1, -1]],
  bridge: [[-8, 3, 6], [5, 2, 5], [0, 1, 0]],
  bed: [[-15, 1.8, -5], [-10, 2.8, -5], [-12, .5, -2.5]],
  clutch: [[-5, -2, 4], [-4, 2, 4], [-5, -.3, 0]],
  duel: [[-2, 2.2, 4], [3, 2.8, 4], [0, 1, 0]],
  break: [[10, 2.4, -5], [14, 3, -4], [12, .7, -2.5]],
  rescue: [[0, 4, 6], [-3, 2, 5], [-3, .6, 0]],
  vow: [[-2, 1.8, 2.8], [2, 2.3, 3.3], [0, 1.25, 0]],
  guardian: [[7, 2, 6], [13, 4, 7], [11, 1.5, 1]],
  fall: [[0, 2, 4], [4, 5, 7], [0, .8, 0]],
  victory: [[-4, 2, 6], [6, 8, 12], [0, 1.4, 0]],
};
const a = new THREE.Vector3(), b = new THREE.Vector3();
export default function movieDirection(world, actors, camera, film, time) {
  const index = Math.min(film.shots.length - 1, Math.floor(time / 12)), action = film.shots[index][0];
  const p = (time % 12) / 12, ease = p * p * (3 - 2 * p), shot = SHOTS[action];
  camera.position.lerpVectors(a.fromArray(shot[0]), b.fromArray(shot[1]), ease); camera.lookAt(...shot[2]);
  const [hero, rival, third] = actors, fighting = action === 'duel', running = action === 'bridge';
  for (const actor of actors) { actor.root.visible = true; actor.root.rotation.set(0, 0, 0); }
  hero.root.position.set(action === 'forge' || action === 'bed' ? -12 : -1, 0, 0);
  rival.root.position.set(1, 0, 0); third.root.position.set(12, 0, 1);
  hero.root.rotation.y = -Math.PI / 2; rival.root.rotation.y = Math.PI / 2;
  if (running) { hero.root.position.x = -10 + ease * 20; rival.root.position.x = 10 - ease * 6; }
  if (fighting) {
    const distance = 1.1 + Math.sin(time * 1.8) * .25;
    hero.root.position.set(-distance, Math.max(0, Math.sin(time * 2)) * .18, 0);
    rival.root.position.set(distance, Math.max(0, Math.cos(time * 2)) * .18, 0);
    camera.position.y += Math.sin(time * 8) * .015;
  }
  if (action === 'clutch' || action === 'rescue') { hero.root.position.set(-5 + ease * 3, -2 * Math.sin(p * Math.PI), -.3); rival.root.position.set(-2, 0, 0); }
  if (action === 'break') hero.root.position.set(12, 0, -1);
  if (action === 'guardian') { hero.root.position.set(9, 0, 2); rival.root.position.set(12, 0, 1); }
  if (action === 'fall') { rival.root.rotation.z = -ease * Math.PI / 2; rival.root.position.y = -.5 * ease; }
  if (action === 'victory') { rival.root.visible = false; hero.root.position.set(0, .08 * Math.sin(time * 2), 0); hero.root.rotation.y = Math.PI; }
  actors.forEach((actor, i) => actor.update(time, running ? 1 : fighting ? .3 : 0, fighting ? Math.max(0, Math.sin(time * 4 + i * Math.PI)) : action === 'victory' && i === 0 ? .9 : 0));
  world.beds.forEach((bed, i) => { bed.visible = !(film.id === 'best-match' && (i === 0 && (index > 3 || index === 3 && p > .45) || i === 2 && (index > 6 || index === 6 && p > .45))); });
  world.bridges.forEach((bridge, i) => { bridge.visible = action !== 'clutch' && action !== 'rescue' || i % 4 !== 0 || p > .55; });
  world.guardian.visible = action === 'guardian'; world.guardian.rotation.z = film.id === 'story-mode' ? ease * .12 : 0;
  world.sparks.rotation.y = time * .08; world.sparks.position.y = action === 'break' ? 2 : 0;
  world.furnace.intensity = 15 + Math.sin(time * 8) * 4;
  return index;
}