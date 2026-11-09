import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import createCrowd from '@/cinema/three/crowd';
import { SCREEN_VERTEX, screenFragment } from '@/cinema/three/screenShaders';

const RADIUS = 26;
const SCREEN_HEIGHT = 17;
const THETA = 1.78;
const ROWS = 20;
const RISE = 0.42;
const ROW_DEPTH = 1.15;
const FRONT_Z = -19;
const HALL_WIDTH = 46;

function buildSeats() {
  const seats = [];
  for (let row = 0; row < ROWS; row++) {
    const z = FRONT_Z + row * ROW_DEPTH;
    const y = 0.15 + row * RISE;
    for (let x = -22; x <= 22.01; x += 0.92) {
      if (Math.abs(Math.abs(x) - 13.5) < 1.05) continue;
      seats.push({ x, y: y + 0.18, z, rowY: y, yaw: Math.PI + (Math.random() - 0.5) * 0.14 });
    }
  }
  return seats;
}

export default function createAuditorium({ aspect }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#05060a');
  scene.fog = new THREE.Fog('#05060a', 36, 100);

  const camera = new THREE.PerspectiveCamera(66, aspect, 0.1, 240);
  camera.position.set(0, 9.9, 5.5);
  camera.lookAt(0, 9, -24);

  const uniformAspect = (RADIUS * THETA) / SCREEN_HEIGHT;
  const uniforms = { uTime: { value: 0 }, uEnergy: { value: 0.25 }, uAspect: { value: uniformAspect } };
  const screenMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: SCREEN_VERTEX,
    fragmentShader: screenFragment('esports'),
    side: THREE.DoubleSide,
  });
  const screen = new THREE.Mesh(
    new THREE.CylinderGeometry(RADIUS, RADIUS, SCREEN_HEIGHT, 96, 1, true, Math.PI - THETA / 2, THETA),
    screenMaterial
  );
  screen.position.y = 8.6;
  scene.add(screen);

  const mask = new THREE.Mesh(
    new THREE.CylinderGeometry(RADIUS + 0.3, RADIUS + 0.3, SCREEN_HEIGHT + 2.6, 64, 1, true, Math.PI - THETA / 2 - 0.06, THETA + 0.12),
    new THREE.MeshBasicMaterial({ color: '#07070a', side: THREE.DoubleSide })
  );
  mask.position.y = 8.6;
  scene.add(mask);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(HALL_WIDTH + 2, 42),
    new THREE.MeshStandardMaterial({ color: '#121016', roughness: 0.55, metalness: 0.2 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0.01, -6);
  scene.add(floor);

  const stepMaterial = new THREE.MeshStandardMaterial({ color: '#1b1a22', roughness: 0.85 });
  const lipMaterial = new THREE.MeshStandardMaterial({ color: '#2a2733', roughness: 0.6, metalness: 0.25 });
  for (let row = 0; row < ROWS; row++) {
    const y = 0.15 + row * RISE;
    const step = new THREE.Mesh(new THREE.BoxGeometry(HALL_WIDTH, RISE, ROW_DEPTH), stepMaterial);
    step.position.set(0, y - RISE / 2, FRONT_Z + row * ROW_DEPTH + ROW_DEPTH / 2);
    scene.add(step);
    const lip = new THREE.Mesh(new THREE.BoxGeometry(HALL_WIDTH, 0.06, 0.1), lipMaterial);
    lip.position.set(0, y - 0.2, FRONT_Z + row * ROW_DEPTH + 0.05);
    scene.add(lip);
  }

  const seats = buildSeats();

  const cushion = new THREE.BoxGeometry(0.58, 0.14, 0.5);
  cushion.translate(0, 0.42, 0);
  const backrest = new THREE.BoxGeometry(0.6, 0.6, 0.11);
  backrest.translate(0, 0.72, -0.27);
  const seatGeometry = mergeGeometries([cushion, backrest]);
  const seatMesh = new THREE.InstancedMesh(
    seatGeometry,
    new THREE.MeshStandardMaterial({ color: '#4a1f2c', roughness: 0.9 }),
    seats.length
  );
  seatMesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
  seatMesh.frustumCulled = false;
  const seatColor = new THREE.Color();
  const seatDummy = new THREE.Object3D();
  seats.forEach((seat, index) => {
    seatDummy.position.set(seat.x, seat.rowY, seat.z);
    seatDummy.rotation.set(0, Math.PI, 0);
    seatDummy.scale.setScalar(1);
    seatDummy.updateMatrix();
    seatMesh.setMatrixAt(index, seatDummy.matrix);
    seatColor.setHSL(0.97, 0.36, 0.16 + Math.random() * 0.05);
    seatMesh.setColorAt(index, seatColor);
  });
  seatMesh.instanceColor.needsUpdate = true;
  scene.add(seatMesh);

  const crowd = createCrowd(seats);
  scene.add(crowd.group);

  const wallMaterial = new THREE.MeshStandardMaterial({ color: '#0f0d14', roughness: 0.94 });
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1, 21, 42), wallMaterial);
  leftWall.position.set(-HALL_WIDTH / 2 - 0.5, 10.5, -6);
  const rightWall = leftWall.clone();
  rightWall.position.x = HALL_WIDTH / 2 + 0.5;
  const rearWall = new THREE.Mesh(new THREE.BoxGeometry(HALL_WIDTH + 3, 21, 1.2), wallMaterial);
  rearWall.position.set(0, 10.5, 14.6);
  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(HALL_WIDTH + 3, 0.6, 42), new THREE.MeshStandardMaterial({ color: '#08080c', roughness: 0.95 }));
  ceiling.position.set(0, 20.6, -6);
  scene.add(leftWall, rightWall, rearWall, ceiling);

  [-1, 1].forEach((side) => {
    for (let i = 0; i < 7; i++) {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 12, 3.4),
        new THREE.MeshStandardMaterial({ color: i % 2 ? '#151320' : '#191624', roughness: 0.9 })
      );
      panel.position.set(side * (HALL_WIDTH / 2 - 0.15), 11, -22 + i * 4.4);
      scene.add(panel);
    }
    const cove = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 34), new THREE.MeshBasicMaterial({ color: '#3c4c6b' }));
    cove.position.set(side * (HALL_WIDTH / 2 - 1.6), 18.4, -8);
    scene.add(cove);
  });

  const fibreGeometry = new THREE.BufferGeometry();
  const fibrePositions = new Float32Array(320 * 3);
  for (let i = 0; i < 320; i++) {
    fibrePositions[i * 3] = (Math.random() - 0.5) * (HALL_WIDTH - 6);
    fibrePositions[i * 3 + 1] = 19.4 + Math.random() * 0.5;
    fibrePositions[i * 3 + 2] = -24 + Math.random() * 36;
  }
  fibreGeometry.setAttribute('position', new THREE.BufferAttribute(fibrePositions, 3));
  const fibreStars = new THREE.Points(
    fibreGeometry,
    new THREE.PointsMaterial({ color: '#8fb6ff', size: 0.11, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  scene.add(fibreStars);

  const curtainMaterial = new THREE.MeshStandardMaterial({ color: '#2a0b12', roughness: 0.95 });
  [-1, 1].forEach((side) => {
    const curtain = new THREE.Mesh(new THREE.BoxGeometry(1.8, 18, 2), curtainMaterial);
    curtain.position.set(side * 21.6, 9, -22.4);
    scene.add(curtain);
  });

  [[-13.5, 0], [13.5, 0]].forEach(([x]) => {
    for (let row = 0; row < ROWS; row += 2) {
      const light = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.06, 0.1),
        new THREE.MeshBasicMaterial({ color: '#ffb469' })
      );
      light.position.set(x, 0.24 + row * RISE, FRONT_Z + row * ROW_DEPTH + 0.9);
      scene.add(light);
    }
  });

  const booth = new THREE.Mesh(new THREE.BoxGeometry(7, 3, 2.6), new THREE.MeshStandardMaterial({ color: '#0d0c12', roughness: 0.85 }));
  booth.position.set(0, 15.2, 12.6);
  const boothWindow = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 1),
    new THREE.MeshStandardMaterial({ color: '#a9d8ff', emissive: '#7fc4ff', emissiveIntensity: 1.6, transparent: true, opacity: 0.7 })
  );
  boothWindow.position.set(0, 15.3, 11.28);
  scene.add(booth, boothWindow);

  const beamStart = new THREE.Vector3(0, 14.4, 11.2);
  const beamEnd = new THREE.Vector3(0, 8.6, -25.7);
  const direction = new THREE.Vector3().subVectors(beamEnd, beamStart);
  const beamLength = direction.length();
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(6.4, 0.09, beamLength, 28, 1, true),
    new THREE.MeshBasicMaterial({ color: '#b9ddff', transparent: true, opacity: 0.045, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  );
  beam.position.copy(beamStart).add(beamEnd).multiplyScalar(0.5);
  beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  scene.add(beam);

  const dustGeometry = new THREE.BufferGeometry();
  const dustPositions = new Float32Array(420 * 3);
  for (let i = 0; i < 420; i++) {
    const ratio = Math.random();
    dustPositions[i * 3] = (Math.random() - 0.5) * (2 + ratio * 12);
    dustPositions[i * 3 + 1] = beamStart.y + (beamEnd.y - beamStart.y) * ratio + (Math.random() - 0.5) * 4;
    dustPositions[i * 3 + 2] = beamStart.z + (beamEnd.z - beamStart.z) * ratio;
  }
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  const beamDust = new THREE.Points(
    dustGeometry,
    new THREE.PointsMaterial({ color: '#cfe8ff', size: 0.07, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  scene.add(beamDust);

  const ambient = new THREE.AmbientLight('#1b2438', 1.4);
  const hemi = new THREE.HemisphereLight('#22304a', '#07070b', 0.75);
  const screenLight = new THREE.PointLight('#7fe9ff', 120, 90, 2);
  screenLight.position.set(0, 8.6, -17);
  const spillLight = new THREE.PointLight('#7fe9ff', 45, 55, 2);
  spillLight.position.set(0, 5.5, -9);
  const ceilingLight = new THREE.PointLight('#ffcf9a', 40, 46, 2);
  ceilingLight.position.set(0, 17.5, 6);
  const fillLight = new THREE.PointLight('#9fc2ff', 60, 55, 2);
  fillLight.position.set(0, 13, -1);
  scene.add(ambient, hemi, screenLight, spillLight, ceilingLight, fillLight);

  let energy = 0.25;
  let time = 0;

  return {
    scene,
    camera,
    pickables: [],
    setExperience(experience) {
      screenMaterial.fragmentShader = screenFragment(experience.id);
      screenMaterial.needsUpdate = true;
      screenLight.color.set(experience.screenLight);
      spillLight.color.set(experience.screenLight);
      ceilingLight.color.set(experience.accent2);
    },
    update(dt, elapsed, mood) {
      time += dt;
      const target = mood?.excitement ?? 0.25;
      energy += (target - energy) * Math.min(1, dt * 1.6);
      uniforms.uTime.value = elapsed;
      uniforms.uEnergy.value = energy;
      crowd.update(elapsed, energy, mood?.gasp ?? 0);
      screenLight.intensity = 85 + energy * 110 + Math.sin(elapsed * 2.7) * 8;
      spillLight.intensity = 32 + energy * 45;
      beam.material.opacity = 0.032 + energy * 0.02 + Math.sin(elapsed * 8.3) * 0.004;
      beamDust.material.opacity = 0.22 + energy * 0.22;
      fibreStars.material.opacity = 0.5 + Math.sin(time * 0.7) * 0.1;
      camera.position.y = 9.9 + Math.sin(time * 0.23) * 0.06;
      camera.position.x = Math.sin(time * 0.17) * 0.14;
      camera.lookAt(0, 9, -24);
    },
    dispose() {
      crowd.dispose();
      seatMesh.dispose();
      seatGeometry.dispose();
      screenMaterial.dispose();
      screen.geometry.dispose();
      mask.geometry.dispose();
      mask.material.dispose();
      beam.geometry.dispose();
      beam.material.dispose();
      dustGeometry.dispose();
      beamDust.material.dispose();
      fibreGeometry.dispose();
      fibreStars.material.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    },
  };
}