import * as THREE from 'three';
import { SCREEN_ASPECT } from '@/cinema/theatreFormat';

// Uploaded video projected onto the curved screen with 70mm treatment:
// filled (cropped) framing to the giant 1.43:1 screen, gate weave, grain,
// projector flicker and a lens vignette.
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D map;
uniform float uTime;
uniform vec2 uSpan;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vec2(1.0 - vUv.x, vUv.y);
  uv = (uv - 0.5) * uSpan + 0.5;
  uv.y += sin(uTime * 0.7) * 0.0007;
  vec3 color = texture2D(map, clamp(uv, 0.002, 0.998)).rgb;
  color += (hash(vUv * 940.0 + floor(uTime * 24.0)) - 0.5) * 0.045;
  color *= 0.984 + sin(uTime * 27.0) * 0.012 + sin(uTime * 3.1) * 0.007;
  float vignette = smoothstep(1.15, 0.34, length((vUv - 0.5) * vec2(1.22, 1.0)));
  color *= 0.82 + vignette * 0.24;
  gl_FragColor = vec4(color, 1.0);
}
`;

export default function videoScreen(video) {
  const texture = new THREE.VideoTexture(video);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      map: { value: texture },
      uTime: { value: 0 },
      uSpan: { value: new THREE.Vector2(1, 1) },
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
  });

  const fit = () => {
    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return;
    const ratio = width / height;
    const wide = ratio > SCREEN_ASPECT;
    material.uniforms.uSpan.value.set(wide ? SCREEN_ASPECT / ratio : 1, wide ? 1 : ratio / SCREEN_ASPECT);
  };
  video.addEventListener('loadedmetadata', fit);
  fit();

  return {
    material,
    fit,
    update(time) { material.uniforms.uTime.value = time; },
    dispose() {
      video.removeEventListener('loadedmetadata', fit);
      texture.dispose();
      material.dispose();
    },
  };
}