import * as THREE from 'three';

export default function movieLighting(scene) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#b4b4b4'; ctx.fillRect(0, 0, 64, 64);
  for (let y = 0; y < 64; y += 4) for (let x = 0; x < 64; x += 4) {
    const value = 140 + Math.floor((Math.sin(x * 81 + y * 19) + 1) * 32);
    ctx.fillStyle = `rgb(${value},${value},${value})`; ctx.fillRect(x, y, 4, 4);
  }
  ctx.strokeStyle = '#777777'; ctx.strokeRect(.5, .5, 63, 63);
  const texture = new THREE.CanvasTexture(canvas); texture.anisotropy = 8;
  const materials = new Set();
  scene.traverse(object => {
    if (!object.isMesh) return;
    object.castShadow = true; object.receiveShadow = true;
    if (object.material.isMeshStandardMaterial) materials.add(object.material);
  });
  materials.forEach(material => { material.bumpMap = texture; material.bumpScale = .055; material.needsUpdate = true; });
  const sun = scene.children.find(child => child.isDirectionalLight);
  sun.castShadow = true; sun.intensity = 2.4; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 14, bottom: -14, near: .5, far: 65 });
  sun.shadow.bias = -.0003; sun.shadow.normalBias = .035;
  const disc = new THREE.Mesh(new THREE.SphereGeometry(2.8, 32, 16), new THREE.MeshBasicMaterial({ color: '#ffe5b8' }));
  disc.position.set(-25, 17, -40); scene.add(disc);
  const halo = new THREE.PointLight('#ffd49a', 40, 45); halo.position.set(-12, 7, -15); scene.add(halo);
  return () => { texture.dispose(); sun.shadow.map?.dispose(); };
}