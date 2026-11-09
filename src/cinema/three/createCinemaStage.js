import * as THREE from 'three';
import buildLobby from '@/cinema/three/lobbyScene';
import buildHub from '@/cinema/three/hubScene';
import createAuditorium from '@/cinema/three/auditoriumScene';

const BUILDERS = { lobby: buildLobby, hub: buildHub, auditorium: createAuditorium };

export default class CinemaStage {
  constructor(host, options = {}) {
    this.host = host;
    this.options = options;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.domElement.className = 'cinema-canvas';
    host.appendChild(this.renderer.domElement);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-4, -4);
    this.mood = { excitement: 0.25, gasp: 0 };
    this.elapsed = 0;
    this.scenes = {};
    this.mode = null;
    this.current = null;
    this.hovered = null;
    this.lastHoverCheck = 0;
    this.disposed = false;

    this.loop = this.loop.bind(this);
    this.resize = this.resize.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onLeave = this.onLeave.bind(this);

    host.addEventListener('pointermove', this.onPointerMove);
    host.addEventListener('pointerdown', this.onPointerDown);
    host.addEventListener('pointerleave', this.onLeave);
    this.onPointerUp = () => this.current?.pointerUp?.();
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
    this.observer = new ResizeObserver(this.resize);
    this.observer.observe(host);
    this.resize();
    this.last = performance.now() / 1000;
    this.raf = requestAnimationFrame(this.loop);
  }

  resize() {
    const width = this.host.clientWidth || 1;
    const height = this.host.clientHeight || 1;
    this.aspect = width / height;
    this.renderer.setSize(width, height, false);
    Object.values(this.scenes).forEach((entry) => {
      entry.camera.aspect = this.aspect;
      entry.camera.updateProjectionMatrix();
    });
  }

  setMode(mode) {
    if (this.mode === mode && this.current) return;
    if (!this.scenes[mode]) {
      const builder = BUILDERS[mode] || BUILDERS.lobby;
      this.scenes[mode] = builder({ aspect: this.aspect || 1 });
      this.scenes[mode].camera.aspect = this.aspect || 1;
      this.scenes[mode].camera.updateProjectionMatrix();
    }
    this.mode = mode;
    this.current = this.scenes[mode];
    this.host.style.cursor = 'default';
    this.hovered = null;
    this.hoveredChanged = null;
    this.hoverAt = null;
    this.options.onHover?.(null);
  }

  setExperience(experience) {
    if (experience) this.scenes.auditorium?.setExperience(experience);
  }

  pickAt(clientX, clientY) {
    if (!this.current?.pickables?.length) return null;
    const rect = this.renderer.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.current.camera);
    const hits = this.raycaster.intersectObjects(this.current.pickables, false);
    if (!hits.length) return null;
    let object = hits[0].object;
    while (object && !object.userData?.pick) object = object.parent;
    return object || null;
  }

  onPointerMove(event) {
    if (this.mode === 'auditorium') { this.current?.pointerMove?.(event); return; }
    const now = performance.now();
    if (now - this.lastHoverCheck < 55) return;
    this.lastHoverCheck = now;
    const object = this.pickAt(event.clientX, event.clientY);
    const moved = !this.hoverAt || Math.hypot(this.hoverAt.x - event.clientX, this.hoverAt.y - event.clientY) > 14;
    if (object === this.hovered && !(object && moved)) return;
    this.hovered = object;
    this.hoverAt = { x: event.clientX, y: event.clientY };
    this.host.style.cursor = object ? 'pointer' : 'default';
    if (this.hoveredChanged !== object) this.current?.hover?.(object);
    this.hoveredChanged = object;
    if (object) {
      this.options.onHover?.({ pick: object.userData.pick, x: event.clientX, y: event.clientY });
    } else {
      this.options.onHover?.(null);
    }
  }

  onPointerDown(event) {
    if (event.button !== 0) return;
    if (this.mode === 'auditorium') { this.current?.pointerDown?.(event); return; }
    const object = this.pickAt(event.clientX, event.clientY);
    if (!object) return;
    event.preventDefault();
    this.options.onPick?.(object.userData.pick);
  }

  onLeave() {
    this.current?.pointerUp?.();
    this.hovered = null;
    this.hoveredChanged = null;
    this.hoverAt = null;
    this.host.style.cursor = 'default';
    this.current?.hover?.(null);
    this.options.onHover?.(null);
  }

  loop() {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    const now = performance.now() / 1000;
    const dt = Math.min(0.06, now - this.last);
    this.last = now;
    const runtime = this.options.getRuntime?.();
    if (runtime && !this.preview) {
      runtime.update(dt);
      this.mood = runtime;
      this.elapsed = runtime.elapsed;
    }
    if (!this.current) return;
    this.current.update(dt, this.preview ? 1.5 : this.elapsed, this.mood);
    this.current.beforeRender?.(this.renderer);
    this.renderer.render(this.current.scene, this.current.camera);
    this.options.onView?.(this.current.camera);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.host.removeEventListener('pointermove', this.onPointerMove);
    this.host.removeEventListener('pointerdown', this.onPointerDown);
    this.host.removeEventListener('pointerleave', this.onLeave);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
    this.observer.disconnect();
    Object.values(this.scenes).forEach((entry) => entry.dispose?.());
    this.scenes = {};
    this.current = null;
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}