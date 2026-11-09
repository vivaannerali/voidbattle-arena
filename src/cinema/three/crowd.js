import * as THREE from 'three';
import playerSkins from '@/game/playerSkins';
import seatedCharacter from '@/components/cinema/seatedCharacter';

export default function createCrowd(seats) {
  const group = new THREE.Group(), batches = new Map(), dummy = new THREE.Object3D();
  seats.forEach((seat, index) => {
    const skin = playerSkins(`CinemaGuest${index}`);
    if (!batches.has(skin.texture)) batches.set(skin.texture, { skin, seats: [] });
    batches.get(skin.texture).seats.push({ ...seat, phase: index * 2.4 });
  });
  for (const batch of batches.values()) {
    batch.geometry = seatedCharacter(batch.skin);
    batch.material = new THREE.MeshStandardMaterial({ map: batch.skin.texture, roughness: .9, emissive: '#59708a', emissiveIntensity: .25 });
    batch.mesh = new THREE.InstancedMesh(batch.geometry, batch.material, batch.seats.length);
    batch.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    batch.mesh.frustumCulled = false; group.add(batch.mesh);
  }
  const update = (elapsed, energy, gasp = 0) => {
    for (const batch of batches.values()) {
      batch.seats.forEach((seat, index) => {
        const bob = Math.sin(elapsed * 1.3 + seat.phase) * (.002 + energy * .008);
        dummy.scale.setScalar(.58);
        dummy.position.set(seat.x, seat.rowY + .18 + bob, seat.z);
        dummy.rotation.set(-gasp * .08, seat.yaw, Math.sin(elapsed + seat.phase) * energy * .025);
        dummy.updateMatrix(); batch.mesh.setMatrixAt(index, dummy.matrix);
      });
      batch.mesh.instanceMatrix.needsUpdate = true;
    }
  };
  update(0, .25);
  return { group, update, dispose() {
    for (const batch of batches.values()) { batch.geometry.dispose(); batch.material.dispose(); batch.mesh.dispose(); }
  } };
}