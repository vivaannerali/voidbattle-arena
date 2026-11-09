import * as THREE from 'three';

export default function movieWorld() {
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#18233c'); scene.fog = new THREE.Fog('#18233c', 35, 100);
  const cube = new THREE.BoxGeometry(1, 1, 1), materials = new Map();
  const box = (parent, color, x, y, z, w, h, d) => {
    if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: .8 }));
    const mesh = new THREE.Mesh(cube, materials.get(color)); mesh.position.set(x, y, z); mesh.scale.set(w, h, d); parent.add(mesh); return mesh;
  };
  const beds = [], bridges = [], islands = [-12, 0, 12];
  islands.forEach((x, index) => {
    box(scene, '#677b58', x, -.6, 0, 8, 1.2, 9); box(scene, '#504b57', x, -2, 0, 6, 2, 7);
    for (let i = 0; i < 4; i++) box(scene, '#373b50', x - 2.5 + i * 1.7, -4, 0, 1.1, 3, 3);
    const bed = new THREE.Group(); bed.position.set(x, .2, -2.5); scene.add(bed);
    box(bed, '#704d33', 0, 0, 0, 1.5, .3, 2.4); box(bed, index === 0 ? '#ffd45f' : '#d84954', 0, .23, .2, 1.5, .2, 1.8);
    box(bed, '#edf2f5', 0, .25, -.8, 1.5, .25, .55); beds.push(bed);
  });
  for (let x = -8; x <= 8; x++) { const mesh = box(scene, x < 0 ? '#ffd45f' : '#ef7777', x, -.3, 0, 1, .6, 1.2); bridges.push(mesh); }
  const forge = new THREE.Group(); forge.position.set(-13, 0, -2); scene.add(forge);
  box(forge, '#373b50', 0, .5, 0, 1.8, 1, 1.5); box(forge, '#ff9149', 0, .65, .77, 1, .5, .04);
  const furnace = new THREE.PointLight('#ff9149', 18, 8); furnace.position.set(-13, 1.5, -1); scene.add(furnace);
  const guardian = new THREE.Group(); guardian.position.set(11, 0, 1.5); scene.add(guardian);
  box(guardian, '#c6cbb9', 0, 1.7, 0, 1.2, 1.5, .65); box(guardian, '#d6dcc7', 0, 2.8, 0, .7, .8, .7);
  for (const s of [-1, 1]) { box(guardian, '#b9c4aa', s * .35, .5, 0, .45, 1, .5); box(guardian, '#b9c4aa', s * .85, 1.7, 0, .4, 1.7, .45); }
  box(guardian, '#ef7777', -.17, 2.9, -.36, .12, .08, .03); box(guardian, '#ef7777', .17, 2.9, -.36, .12, .08, .03);
  for (let i = 0; i < 14; i++) { const angle = i * 2.4; box(scene, '#343e58', Math.sin(angle) * 30, -3 + i % 4, Math.cos(angle) * 28, 3, 6 + i % 5, 3); }
  const sun = new THREE.DirectionalLight('#ffe9c6', 3); sun.position.set(-8, 18, -12);
  scene.add(sun, new THREE.HemisphereLight('#b5d8ff', '#37304c', 2));
  const rim = new THREE.PointLight('#73e4e8', 90, 35); rim.position.set(0, 8, 5); scene.add(rim);
  const positions = new Float32Array(180 * 3);
  for (let i = 0; i < positions.length; i++) positions[i] = Math.sin(i * 147.3) * 20;
  const sparks = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(positions, 3)), new THREE.PointsMaterial({ color: '#ffd45f', size: .09 })); scene.add(sparks);
  return { scene, beds, bridges, guardian, forge, sparks, furnace };
}