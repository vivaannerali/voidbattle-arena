import * as THREE from 'three';
import playerSkins from '@/game/playerSkins';
import seatedCharacter from '@/components/cinema/seatedCharacter';

export default function SeatedView(scene, camera, position) {
  const skin = playerSkins('CinemaPlayer');
  const material = new THREE.MeshStandardMaterial({ map: skin.texture, roughness: .9, emissive: '#59708a', emissiveIntensity: .3 });
  const body = new THREE.Mesh(seatedCharacter(skin, true), material);
  body.scale.setScalar(.65); scene.add(body);
  const eye = new THREE.Vector3();
  let yaw = 0, pitch = 0, targetYaw = 0, targetPitch = 0, pointer = null;
  const setSeat = next => {
    body.position.copy(next); body.position.y += .15;
    eye.copy(next).add(new THREE.Vector3(0, 1.48, 0));
    targetYaw = yaw = Math.atan2(next.x, next.z + 26);
    targetPitch = pitch = Math.atan2(8.6 - eye.y, Math.hypot(next.x, next.z + 26));
    pointer = null;
  };
  setSeat(position);
  return {
    setSeat,
    pointerDown(event) { pointer = { id: event.pointerId, x: event.clientX, y: event.clientY }; },
    pointerMove(event) {
      if (!pointer || event.pointerId !== pointer.id) return;
      targetYaw = THREE.MathUtils.clamp(targetYaw - (event.clientX - pointer.x) * .004, -1.35, 1.35);
      targetPitch = THREE.MathUtils.clamp(targetPitch - (event.clientY - pointer.y) * .004, -1.15, .65);
      pointer.x = event.clientX; pointer.y = event.clientY;
    },
    pointerUp() { pointer = null; },
    update(dt, time) {
      const blend = 1 - Math.exp(-dt * 14);
      yaw += (targetYaw - yaw) * blend; pitch += (targetPitch - pitch) * blend;
      camera.position.copy(eye); camera.position.y += Math.sin(time * 1.2) * .006;
      camera.rotation.set(pitch, yaw, 0, 'YXZ');
    },
  };
}