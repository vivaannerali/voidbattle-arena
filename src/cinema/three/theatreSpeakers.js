import * as THREE from 'three';
import { SPEAKER_POSITIONS } from '@/cinema/theatreFormat';

export default function theatreSpeakers(scene) {
  const cabinet = new THREE.BoxGeometry(1, 1.7, .55);
  const material = new THREE.MeshStandardMaterial({ color: '#10131a', roughness: .9 });
  const grille = new THREE.CylinderGeometry(.31, .31, .03, 24);
  const grilleMaterial = new THREE.MeshStandardMaterial({ color: '#242832', roughness: .8 });
  SPEAKER_POSITIONS.forEach(position => {
    const speaker = new THREE.Group(); speaker.position.set(...position); speaker.lookAt(0, 5, 0);
    speaker.add(new THREE.Mesh(cabinet, material));
    for (const y of [-.4, .4]) {
      const driver = new THREE.Mesh(grille, grilleMaterial);
      driver.rotation.x = Math.PI / 2; driver.position.set(0, y, .3); speaker.add(driver);
    }
    scene.add(speaker);
  });
}