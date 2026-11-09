import * as THREE from 'three';
import { posterTexture, signTexture } from '@/cinema/three/sceneKit';
import { EXPERIENCES } from '@/cinema/cinemaContent';

export default function buildHub({ aspect }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#06050a');
  scene.fog = new THREE.Fog('#06050a', 18, 52);

  const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
  camera.position.set(0, 1.8, 11);
  camera.lookAt(0, 4.2, -11);

  const pickables = [];
  const posters = [];

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(44, 30),
    new THREE.MeshStandardMaterial({ color: '#14131b', roughness: 0.24, metalness: 0.5 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = 0;
  scene.add(floor);

  const carpet = new THREE.Mesh(
    new THREE.PlaneGeometry(5.6, 24),
    new THREE.MeshStandardMaterial({ color: '#55141f', roughness: 0.95 })
  );
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.set(0, 0.02, -1);
  scene.add(carpet);
  [-2.9, 2.9].forEach((x) => {
    const edge = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 24), new THREE.MeshStandardMaterial({ color: '#c9a25c', roughness: 0.4, metalness: 0.8 }));
    edge.rotation.x = -Math.PI / 2;
    edge.position.set(x, 0.03, -1);
    scene.add(edge);
  });

  const wallMaterial = new THREE.MeshStandardMaterial({ color: '#14121b', roughness: 0.92 });
  const back = new THREE.Mesh(new THREE.BoxGeometry(42, 14, 0.8), wallMaterial);
  back.position.set(0, 7, -11.4);
  scene.add(back);
  [-20.5, 20.5].forEach((x) => {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.8, 14, 26), wallMaterial);
    side.position.set(x, 7, 0);
    scene.add(side);
    for (let i = 0; i < 5; i++) {
      const pilaster = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 13, 1.4),
        new THREE.MeshStandardMaterial({ color: '#1c1926', roughness: 0.8 })
      );
      pilaster.position.set(x + (x > 0 ? -0.5 : 0.5), 6.5, -9 + i * 4.6);
      scene.add(pilaster);
    }
  });
  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(42, 0.5, 26), new THREE.MeshStandardMaterial({ color: '#0b0a10', roughness: 0.95 }));
  ceiling.position.set(0, 13.6, 0);
  scene.add(ceiling);

  const glowMaterial = new THREE.MeshBasicMaterial({ color: '#f0c887' });
  [-18, 18].forEach((x) => {
    const cove = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 22), glowMaterial);
    cove.position.set(x + (x > 0 ? -0.9 : 0.9), 13.1, 0);
    scene.add(cove);
  });

  // Grand doors
  const doorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(7.4, 7, 0.5),
    new THREE.MeshStandardMaterial({ color: '#2a2230', roughness: 0.55, metalness: 0.35 })
  );
  doorFrame.position.set(0, 3.5, -10.9);
  scene.add(doorFrame);
  const doorMaterial = new THREE.MeshStandardMaterial({ color: '#1d1418', roughness: 0.45, metalness: 0.3 });
  const doorGlow = new THREE.PointLight('#ffd9a0', 30, 14, 2);
  doorGlow.position.set(0, 2.4, -9.4);
  scene.add(doorGlow);
  [-1.55, 1.55].forEach((x, index) => {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(2.9, 6.2, 0.32), doorMaterial);
    panel.position.set(x, 3.1, -10.6);
    panel.userData.pick = { action: 'doors', label: 'Auditorium Doors', hint: 'Choose a presentation to open them' };
    scene.add(panel);
    pickables.push(panel);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.1, 10), new THREE.MeshStandardMaterial({ color: '#d9b071', metalness: 0.9, roughness: 0.25 }));
    handle.position.set(x + (index === 0 ? 1.05 : -1.05), 3, -10.4);
    scene.add(handle);
  });

  const nameSign = new THREE.Mesh(
    new THREE.PlaneGeometry(6.4, 1.6),
    new THREE.MeshBasicMaterial({ map: signTexture('IMAX 70MM', 'ULTIMATE ARENA', '#d9ab5a'), transparent: true })
  );
  nameSign.position.set(0, 8, -10.9);
  scene.add(nameSign);

  EXPERIENCES.forEach((experience, index) => {
    const slots = [
      { x: -15, y: 4.4, w: 4.2, h: 6.4 },
      { x: -9.6, y: 4.4, w: 4.2, h: 6.4 },
      { x: 9.6, y: 4.4, w: 4.2, h: 6.4 },
      { x: 15, y: 4.4, w: 4.2, h: 6.4 },
      { x: 0, y: 11, w: 2.75, h: 4.13 },
    ];
    const slot = slots[index];
    const texture = posterTexture(experience, index);
    const poster = new THREE.Mesh(
      new THREE.PlaneGeometry(slot.w, slot.h),
      new THREE.MeshBasicMaterial({ map: texture })
    );
    poster.position.set(slot.x, slot.y, -10.85);
    poster.userData.pick = { action: 'experience', id: experience.id, label: experience.marquee, hint: experience.tagline };
    poster.userData.baseScale = 1;
    poster.userData.hover = 0;
    poster.userData.hoverTarget = 0;
    scene.add(poster);
    pickables.push(poster);
    posters.push(poster);

    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(slot.w + 0.24, slot.h + 0.24, 0.12),
      new THREE.MeshStandardMaterial({ color: '#0d0c12', roughness: 0.5, metalness: 0.45 })
    );
    frame.position.set(slot.x, slot.y, -10.93);
    scene.add(frame);

    const light = new THREE.PointLight(experience.accent, 6, 8, 2);
    light.position.set(slot.x, slot.y - slot.h / 2 + 0.4, -9.6);
    scene.add(light);
  });

  const ambient = new THREE.AmbientLight('#2a2b3d', 0.9);
  const hemi = new THREE.HemisphereLight('#2c3550', '#0a0a10', 0.5);
  const keyLight = new THREE.PointLight('#ffd8a8', 45, 30, 2);
  keyLight.position.set(0, 10, -2);
  const coolLight = new THREE.PointLight('#6f8dff', 30, 26, 2);
  coolLight.position.set(-12, 8, 4);
  scene.add(ambient, hemi, keyLight, coolLight);

  let time = 0;

  return {
    scene,
    camera,
    pickables,
    hover(object) {
      posters.forEach((poster) => {
        poster.userData.hoverTarget = poster === object ? 1 : 0;
      });
    },
    update(dt) {
      time += dt;
      camera.position.z = 11 + Math.sin(time * 0.24) * 0.45;
      camera.position.x = Math.sin(time * 0.19) * 0.7;
      camera.lookAt(Math.sin(time * 0.15) * 0.5, 4.4, -11);
      posters.forEach((poster) => {
        poster.userData.hover += (poster.userData.hoverTarget - poster.userData.hover) * Math.min(1, dt * 9);
        const hover = poster.userData.hover;
        poster.scale.setScalar(1 + hover * 0.045);
        poster.material.color.setScalar(0.82 + hover * 0.3 + Math.sin(time * 1.4 + poster.position.x) * 0.04);
      });
      doorGlow.intensity = 26 + Math.sin(time * 1.2) * 4;
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