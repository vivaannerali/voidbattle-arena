import * as THREE from 'three';

export default function movieFrame(camera) {
  const material = new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, depthTest: false, depthWrite: false });
  const fade = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), material);
  fade.position.z = -3; fade.renderOrder = 200; camera.add(fade);
  const bars = new THREE.MeshBasicMaterial({ color: '#000000', depthTest: false });
  for (const side of [-1, 1]) {
    const bar = new THREE.Mesh(new THREE.PlaneGeometry(12, .18), bars);
    bar.position.set(0, side * 1.34, -3); bar.renderOrder = 150; camera.add(bar);
  }
  return time => {
    const local = time % 12;
    material.opacity = local < .55 ? 1 - local / .55 : local > 11.5 ? (local - 11.5) / .5 : 0;
  };
}