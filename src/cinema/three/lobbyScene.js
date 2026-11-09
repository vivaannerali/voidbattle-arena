import * as THREE from 'three';
import { createSnackModel } from '@/cinema/three/snackModels';
import { textTexture, menuTexture, signTexture } from '@/cinema/three/sceneKit';
import { SNACKS } from '@/cinema/snacks';

function tileTexture() {
  return textTexture({
    width: 512,
    height: 512,
    draw(ctx, w, h) {
      ctx.fillStyle = '#1b1a22';
      ctx.fillRect(0, 0, w, h);
      const size = w / 4;
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          const shade = 26 + Math.floor(Math.random() * 10);
          ctx.fillStyle = `rgb(${shade},${shade - 1},${shade + 6})`;
          ctx.fillRect(x * size + 2, y * size + 2, size - 4, size - 4);
        }
      }
      ctx.strokeStyle = 'rgba(214,176,106,0.16)';
      ctx.lineWidth = 2;
      for (let i = 0; i <= 4; i++) {
        ctx.beginPath(); ctx.moveTo(i * size, 0); ctx.lineTo(i * size, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * size); ctx.lineTo(w, i * size); ctx.stroke();
      }
    },
  });
}

export default function buildLobby({ aspect }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#07060b');
  scene.fog = new THREE.Fog('#07060b', 11, 32);

  const camera = new THREE.PerspectiveCamera(52, aspect, 0.1, 70);
  camera.position.set(0, 1.62, 7.2);
  camera.lookAt(0, 1.42, -5.6);

  const pickables = [];
  const items = [];

  const floorTexture = tileTexture();
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(4, 3);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(36, 26),
    new THREE.MeshStandardMaterial({ map: floorTexture, color: '#5b5a68', roughness: 0.3, metalness: 0.35 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = -2;
  scene.add(floor);

  const wallMaterial = new THREE.MeshStandardMaterial({ color: '#16141f', roughness: 0.9 });
  const back = new THREE.Mesh(new THREE.BoxGeometry(36, 10, 0.6), wallMaterial);
  back.position.set(0, 5, -10.2);
  const left = new THREE.Mesh(new THREE.BoxGeometry(0.6, 10, 24), wallMaterial);
  left.position.set(-18, 5, -1.5);
  const right = left.clone();
  right.position.x = 18;
  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(36, 0.4, 24), new THREE.MeshStandardMaterial({ color: '#0c0b11', roughness: 0.95 }));
  ceiling.position.set(0, 9.4, -1.5);
  scene.add(back, left, right, ceiling);

  const stripMaterial = new THREE.MeshBasicMaterial({ color: '#ffd9a0' });
  for (let i = 0; i < 4; i++) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 9), stripMaterial);
    strip.position.set(-7.5 + i * 5, 9.15, -3);
    scene.add(strip);
  }

  const counterMaterial = new THREE.MeshStandardMaterial({ color: '#231e2b', roughness: 0.4, metalness: 0.3 });
  const counter = new THREE.Mesh(new THREE.BoxGeometry(17, 1.05, 1.6), counterMaterial);
  counter.position.set(0, 0.52, -5.6);
  const counterTop = new THREE.Mesh(
    new THREE.BoxGeometry(17.4, 0.12, 2),
    new THREE.MeshStandardMaterial({ color: '#3b3448', roughness: 0.22, metalness: 0.62 })
  );
  counterTop.position.set(0, 1.08, -5.55);
  scene.add(counter, counterTop);

  const menu = menuTexture(SNACKS);
  const menuBoard = new THREE.Mesh(
    new THREE.PlaneGeometry(9.4, 4.7),
    new THREE.MeshStandardMaterial({ map: menu, emissiveMap: menu, emissive: '#ffffff', emissiveIntensity: 0.45, roughness: 0.6 })
  );
  menuBoard.position.set(0, 4.35, -9.85);
  scene.add(menuBoard);

  const neon = new THREE.Mesh(
    new THREE.PlaneGeometry(6.4, 1.6),
    new THREE.MeshBasicMaterial({ map: signTexture('CANDY BAR', 'EVERYTHING $0.00 · PREMIUM FREE PASS', '#ffd27a'), transparent: true })
  );
  neon.position.set(0, 6.7, -9.8);
  scene.add(neon);

  const shelfMaterial = new THREE.MeshStandardMaterial({ color: '#2a2434', roughness: 0.7 });
  for (let row = 0; row < 2; row++) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(13, 0.12, 0.7), shelfMaterial);
    shelf.position.set(0, 2.1 + row * 1.5, -8.6);
    scene.add(shelf);
    for (let i = 0; i < 9; i++) {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.44, 0.3),
        new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(Math.random(), 0.45, 0.42), roughness: 0.65 })
      );
      box.position.set(-5.6 + i * 1.35, 2.1 + row * 1.5 + 0.28, -8.6);
      scene.add(box);
    }
  }

  const popcornMachine = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.1, 1.1),
    new THREE.MeshStandardMaterial({ color: '#8d1f2a', roughness: 0.5, metalness: 0.25 })
  );
  popcornMachine.position.set(-5.4, 1.75, -7.8);
  const machineGlow = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.7, 0.9),
    new THREE.MeshStandardMaterial({ color: '#ffe1a8', emissive: '#ffc46b', emissiveIntensity: 1.4, roughness: 0.4 })
  );
  machineGlow.position.set(-5.4, 1.7, -7.75);
  scene.add(popcornMachine, machineGlow);

  const fountain = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 1.05, 0.9),
    new THREE.MeshStandardMaterial({ color: '#1d2430', roughness: 0.45, metalness: 0.5 })
  );
  fountain.position.set(5.2, 1.72, -7.9);
  scene.add(fountain);
  for (let i = 0; i < 4; i++) {
    const nozzle = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.3, 0.16),
      new THREE.MeshStandardMaterial({ color: '#d8dee8', roughness: 0.3, metalness: 0.8 })
    );
    nozzle.position.set(4.4 + i * 0.55, 2.02, -7.6);
    scene.add(nozzle);
  }

  const counterTopY = 1.14;
  SNACKS.forEach((snack, index) => {
    const group = createSnackModel(snack);
    group.position.set(-4.8 + index * 1.6, counterTopY, -5.5);
    group.scale.setScalar(snack.size);
    group.userData.pick = { action: 'snack', id: snack.id, label: snack.name, hint: 'Collect · $0.00' };
    group.userData.hoverTarget = 0;
    group.userData.hover = 0;
    group.userData.baseSize = snack.size;
    scene.add(group);
    items.push(group);

    const hit = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 1.05, 1.05),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    hit.position.set(0, 0.34, 0);
    group.add(hit);
    pickables.push(hit);

    const glow = new THREE.PointLight(group.userData.haloColor || '#ffd68a', 2.4, 1.6, 2);
    glow.position.set(0, 0.34, 0.2);
    group.add(glow);
  });

  const ambient = new THREE.AmbientLight('#40455e', 0.85);
  const hemi = new THREE.HemisphereLight('#33405c', '#0a0a10', 0.55);
  const counterLight = new THREE.PointLight('#ffcf8a', 55, 17, 2);
  counterLight.position.set(0, 4.1, -4.4);
  const rimLight = new THREE.PointLight('#6d8cff', 26, 22, 2);
  rimLight.position.set(-6, 6, 3.5);
  const accentLight = new THREE.PointLight('#ff79c8', 20, 18, 2);
  accentLight.position.set(7.5, 5, 1.5);
  scene.add(ambient, hemi, counterLight, rimLight, accentLight);

  const dustGeometry = new THREE.BufferGeometry();
  const dustPositions = new Float32Array(220 * 3);
  for (let i = 0; i < 220; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 30;
    dustPositions[i * 3 + 1] = Math.random() * 8;
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 2;
  }
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(
    dustGeometry,
    new THREE.PointsMaterial({ color: '#ffe9c4', size: 0.045, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  scene.add(dust);

  let time = 0;

  return {
    scene,
    camera,
    pickables,
    hover(object) {
      items.forEach((item) => {
        item.userData.hoverTarget = item === object ? 1 : 0;
      });
    },
    update(dt) {
      time += dt;
      camera.position.x = Math.sin(time * 0.28) * 0.5;
      camera.position.y = 1.62 + Math.sin(time * 0.42) * 0.05;
      camera.lookAt(Math.sin(time * 0.22) * 0.7, 1.4, -5.6);
      dust.rotation.y = time * 0.01;
      items.forEach((item) => {
        const target = item.userData.hoverTarget;
        item.userData.hover += (target - item.userData.hover) * Math.min(1, dt * 10);
        const hover = item.userData.hover;
        item.scale.setScalar(item.userData.baseSize * (1 + hover * 0.14));
        item.position.y = counterTopY + hover * 0.06;
        const halo = item.userData.halo;
        if (halo) {
          halo.material.opacity = 0.25 + hover * 0.75;
          halo.scale.setScalar(1 + Math.sin(time * 3) * 0.03 + hover * 0.18);
        }
      });
      counterLight.intensity = 52 + Math.sin(time * 1.7) * 3;
    },
    dispose() {
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            Object.values(material).forEach((value) => { if (value && value.isTexture) value.dispose(); });
            material.dispose();
          });
        }
      });
    },
  };
}