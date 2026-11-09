import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const SKIN = ['#e9c6a1', '#c99168', '#8d5c3c', '#5f3f2c', '#f2d5b6', '#a97450', '#d8ab84'];
const CLOTHES = ['#2a3140', '#3a2a35', '#1f2c2a', '#33283f', '#252a30', '#3c3530', '#2d3a4a', '#40342a', '#1d262f'];

export default function createCrowd(seats) {
  const count = seats.length;

  const torso = new THREE.CylinderGeometry(0.16, 0.24, 0.58, 6, 1);
  torso.translate(0, 0.29, 0);
  const shoulders = new THREE.SphereGeometry(0.2, 7, 5);
  shoulders.scale(1.12, 0.6, 0.82);
  shoulders.translate(0, 0.58, 0);
  const bodyGeometry = mergeGeometries([torso, shoulders]);

  const headGeometry = new THREE.SphereGeometry(0.115, 7, 5);
  headGeometry.translate(0, 0.77, 0);

  const armLeft = new THREE.BoxGeometry(0.05, 0.32, 0.05);
  armLeft.translate(0, 0.16, 0);
  armLeft.rotateZ(0.42);
  armLeft.translate(-0.2, 0.5, 0);
  const armRight = new THREE.BoxGeometry(0.05, 0.32, 0.05);
  armRight.translate(0, 0.16, 0);
  armRight.rotateZ(-0.42);
  armRight.translate(0.2, 0.5, 0);
  const armGeometry = mergeGeometries([armLeft, armRight]);

  const bodyMaterial = new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0.02, emissive: '#0a1018', emissiveIntensity: 0.55 });
  const headMaterial = new THREE.MeshStandardMaterial({ roughness: 0.86, metalness: 0, emissive: '#0a1018', emissiveIntensity: 0.5 });
  const armMaterial = new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0.02, emissive: '#0a1018', emissiveIntensity: 0.5 });

  const bodies = new THREE.InstancedMesh(bodyGeometry, bodyMaterial, count);
  const heads = new THREE.InstancedMesh(headGeometry, headMaterial, count);
  const arms = new THREE.InstancedMesh(armGeometry, armMaterial, count);
  [bodies, heads, arms].forEach((mesh) => {
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;
  });

  const ax = new Float32Array(count);
  const ay = new Float32Array(count);
  const az = new Float32Array(count);
  const yaw = new Float32Array(count);
  const phase = new Float32Array(count);
  const speed = new Float32Array(count);
  const lively = new Float32Array(count);
  const armState = new Float32Array(count);
  const color = new THREE.Color();

  seats.forEach((seat, index) => {
    ax[index] = seat.x;
    ay[index] = seat.y;
    az[index] = seat.z;
    yaw[index] = seat.yaw;
    phase[index] = Math.random() * Math.PI * 2;
    speed[index] = Math.random() * 0.9;
    lively[index] = 0.55 + Math.random() * 0.7;
    bodies.setColorAt(index, color.set(CLOTHES[index % CLOTHES.length]));
    arms.setColorAt(index, color.set(CLOTHES[(index + 3) % CLOTHES.length]));
    heads.setColorAt(index, color.set(SKIN[index % SKIN.length]));
  });
  bodies.instanceColor.needsUpdate = true;
  heads.instanceColor.needsUpdate = true;
  arms.instanceColor.needsUpdate = true;

  const group = new THREE.Group();
  group.add(bodies, heads, arms);

  const dummy = new THREE.Object3D();
  let energy = 0.2;

  return {
    group,
    get energy() {
      return energy;
    },
    update(elapsed, targetEnergy, gasp) {
      energy += (targetEnergy - energy) * 0.06;
      const e = energy;
      for (let i = 0; i < count; i++) {
        const intensity = Math.min(1.2, lively[i] * e);
        const wobble = Math.sin(elapsed * (1.1 + speed[i]) + phase[i]);
        const bounce = Math.max(0, Math.sin(elapsed * (2.6 + speed[i] * 1.4) + phase[i]));
        const bob = wobble * (0.012 + intensity * 0.075) + bounce * intensity * 0.085;
        dummy.position.set(ax[i], ay[i] + bob, az[i]);
        dummy.rotation.set(-gasp * 0.26, yaw[i] + Math.sin(elapsed * 0.6 + phase[i]) * (0.03 + intensity * 0.08), 0);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        bodies.setMatrixAt(i, dummy.matrix);
        heads.setMatrixAt(i, dummy.matrix);

        const wanted = intensity > 0.5 ? Math.min(1, (intensity - 0.5) * 2.4) : 0;
        armState[i] += (wanted - armState[i]) * 0.12;
        dummy.scale.setScalar(Math.max(0.001, armState[i]));
        dummy.updateMatrix();
        arms.setMatrixAt(i, dummy.matrix);
      }
      bodies.instanceMatrix.needsUpdate = true;
      heads.instanceMatrix.needsUpdate = true;
      arms.instanceMatrix.needsUpdate = true;
    },
    dispose() {
      [bodyGeometry, headGeometry, armGeometry].forEach((geometry) => geometry.dispose());
      [bodyMaterial, headMaterial, armMaterial].forEach((material) => material.dispose());
      bodies.dispose();
      heads.dispose();
      arms.dispose();
    },
  };
}