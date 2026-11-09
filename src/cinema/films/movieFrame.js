import * as THREE from 'three';

export default function movieFrame(camera) {
  const material = new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, depthTest: false, depthWrite: false });
  const fade = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), material);
  fade.position.z = -3; fade.renderOrder = 200; camera.add(fade);
  return time => {
    const local = time % 12;
    material.opacity = local < .55 ? 1 - local / .55 : local > 11.5 ? (local - 11.5) / .5 : 0;
  };
}