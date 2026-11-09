import * as THREE from 'three';
import { textTexture } from '@/cinema/three/sceneKit';

const cache = {};

function material(key, factory) {
  if (!cache[key]) cache[key] = factory();
  return cache[key];
}

const gold = () => material('gold', () => new THREE.MeshStandardMaterial({ color: '#c9a25c', metalness: 0.85, roughness: 0.32 }));
const cream = () => material('cream', () => new THREE.MeshStandardMaterial({ color: '#f4e9c8', roughness: 0.9 }));
const popcorn = () => material('popcorn', () => new THREE.MeshStandardMaterial({ color: '#fbf1cf', roughness: 1, emissive: '#3a2f1c', emissiveIntensity: 0.35 }));
const chocolate = () => material('choc', () => new THREE.MeshStandardMaterial({ color: '#4a2a18', roughness: 0.55, metalness: 0.15 }));
const cheese = () => material('cheese', () => new THREE.MeshStandardMaterial({ color: '#e8a63c', roughness: 0.5, emissive: '#6d3d05', emissiveIntensity: 0.5 }));
const chip = () => material('chip', () => new THREE.MeshStandardMaterial({ color: '#e7c46a', roughness: 0.85, flatShading: true }));
const darkPlastic = () => material('darkplastic', () => new THREE.MeshStandardMaterial({ color: '#121214', roughness: 0.6 }));
const iceCup = () => material('icecup', () => new THREE.MeshStandardMaterial({ color: '#e8f4ff', roughness: 0.35, transparent: true, opacity: 0.55 }));
const candyWrap = () => material('candywrap', () => new THREE.MeshStandardMaterial({ color: '#f5f0ff', roughness: 0.3, metalness: 0.55 }));

function stripesTexture() {
  return textTexture({
    width: 256,
    height: 256,
    draw(ctx, w, h) {
      ctx.fillStyle = '#f7f2e6';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#cf2b3d';
      for (let i = 0; i < 8; i++) ctx.fillRect(i * (w / 8) + w / 16, 0, w / 16, h);
      const warm = ctx.createLinearGradient(0, 0, 0, h);
      warm.addColorStop(0, 'rgba(255,255,255,0.22)');
      warm.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = warm;
      ctx.fillRect(0, 0, w, h);
    },
  });
}

function sodaTexture() {
  return textTexture({
    width: 256,
    height: 256,
    draw(ctx, w, h) {
      const gradient = ctx.createLinearGradient(0, 0, w, 0);
      gradient.addColorStop(0, '#8f1d24');
      gradient.addColorStop(0.45, '#d8393f');
      gradient.addColorStop(1, '#7d161d');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fillRect(0, h * 0.42, w, h * 0.16);
      ctx.fillStyle = '#a8121a';
      ctx.font = '800 44px Helvetica Neue, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('COLA', w / 2, h * 0.56);
    },
  });
}

function candyTexture() {
  return textTexture({
    width: 256,
    height: 256,
    draw(ctx, w, h) {
      ctx.fillStyle = '#f7f2ff';
      ctx.fillRect(0, 0, w, h);
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, '#6ee7ff');
      gradient.addColorStop(0.5, '#ff7ad9');
      gradient.addColorStop(1, '#ffe066');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.44, w * 0.26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2b0d3a';
      ctx.font = '800 34px Helvetica Neue, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SOUR', w / 2, h * 0.82);
    },
  });
}

export function createSnackModel(snack) {
  const group = new THREE.Group();
  let haloColor = '#ffd68a';

  if (snack.model === 'popcorn') {
    const stripeMaterial = new THREE.MeshStandardMaterial({ map: stripesTexture(), roughness: 0.72 });
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.072, 0.24, 20, 1, true), stripeMaterial);
    cup.position.y = 0.12;
    const fill = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.068, 0.2, 16), cream());
    fill.position.y = 0.12;
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.007, 6, 20), gold());
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.24;
    group.add(cup, fill, rim);
    const puffGeometry = new THREE.SphereGeometry(0.028, 6, 5);
    for (let i = 0; i < 14; i++) {
      const puff = new THREE.Mesh(puffGeometry, popcorn());
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.075;
      puff.position.set(Math.cos(angle) * radius, 0.25 + Math.random() * 0.05, Math.sin(angle) * radius);
      puff.scale.setScalar(0.8 + Math.random() * 0.7);
      group.add(puff);
    }
    haloColor = '#ffe6a8';
  } else if (snack.model === 'choc') {
    const coneCup = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.03, 0.12, 16), darkPlastic());
    coneCup.position.y = 0.06;
    const scoop = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 12), cream());
    scoop.position.y = 0.16;
    scoop.scale.set(1, 1.15, 1);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.078, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), chocolate());
    cap.position.y = 0.165;
    cap.scale.set(1, 1.1, 1);
    const flake = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.19, 0.016), chocolate());
    flake.position.set(0.055, 0.22, 0);
    flake.rotation.z = -0.35;
    group.add(coneCup, scoop, cap, flake);
    haloColor = '#d6ac74';
  } else if (snack.model === 'nachos') {
    const tray = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.035, 0.2), darkPlastic());
    tray.position.y = 0.02;
    group.add(tray);
    const chipGeometry = new THREE.ConeGeometry(0.05, 0.014, 3);
    for (let i = 0; i < 9; i++) {
      const chipMesh = new THREE.Mesh(chipGeometry, chip());
      chipMesh.position.set((Math.random() - 0.5) * 0.19, 0.045 + Math.random() * 0.03, (Math.random() - 0.5) * 0.14);
      chipMesh.rotation.set(Math.random() * 1.2, Math.random() * 3, Math.random() * 1.2);
      group.add(chipMesh);
    }
    const blob = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), cheese());
    blob.position.set(0.01, 0.09, 0.01);
    blob.scale.set(1.25, 0.55, 1.15);
    group.add(blob);
    haloColor = '#ffc85c';
  } else if (snack.model === 'soda') {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.062, 0.26, 20), new THREE.MeshStandardMaterial({ map: sodaTexture(), roughness: 0.55 }));
    cup.position.y = 0.13;
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 20), iceCup());
    lid.position.y = 0.27;
    const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.26, 6), new THREE.MeshStandardMaterial({ color: '#f6f6f6', roughness: 0.4 }));
    straw.position.set(0.045, 0.34, 0);
    straw.rotation.z = 0.28;
    group.add(cup, lid, straw);
    haloColor = '#ff8f96';
  } else {
    const bag = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.22, 0.07), candyWrap());
    bag.position.y = 0.11;
    bag.rotation.y = 0.3;
    const label = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 0.18), new THREE.MeshStandardMaterial({ map: candyTexture(), roughness: 0.5 }));
    label.position.set(0.002, 0.11, 0.04);
    label.rotation.y = 0.3;
    group.add(bag, label);
    const colors = ['#ff5fa2', '#5fe3ff', '#ffe066', '#a77bff'];
    for (let i = 0; i < 6; i++) {
      const sweet = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), new THREE.MeshStandardMaterial({ color: colors[i % colors.length], roughness: 0.25 }));
      sweet.position.set((Math.random() - 0.5) * 0.2, 0.018, (Math.random() - 0.5) * 0.16);
      group.add(sweet);
    }
    haloColor = '#ff9bd2';
  }

  const halo = new THREE.Mesh(
    new THREE.RingGeometry(0.14, 0.2, 28),
    new THREE.MeshBasicMaterial({ color: haloColor, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })
  );
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = 0.004;
  group.add(halo);
  group.userData.halo = halo;
  group.userData.haloColor = haloColor;
  return group;
}