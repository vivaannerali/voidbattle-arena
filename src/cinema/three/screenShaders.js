const PRELUDE = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uEnergy;
uniform float uAspect;

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++){
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

vec2 screenUv(){
  return (vec2(1.0 - vUv.x, vUv.y) - 0.5) * vec2(uAspect, 1.0);
}

float vignette(vec2 uv){
  return smoothstep(1.25, 0.28, length(uv));
}

float grain(float t){
  return (hash(vUv * vec2(1024.0, 512.0) + t) - 0.5);
}

float filmGate(float t){
  return smoothstep(0.0035, 0.0, abs(fract(uTime * 0.05) - 0.5)) * 0.04;
}
`;

const BODIES = {
  esports: /* glsl */ `
void main(){
  vec2 uv = screenUv();
  float t = uTime;
  float e = uEnergy;
  vec3 col = mix(vec3(0.015, 0.02, 0.055), vec3(0.055, 0.02, 0.125), vUv.y);
  col += vec3(0.16, 0.22, 0.55) * pow(max(0.0, 1.0 - abs(uv.y + 0.34) * 3.2), 3.0) * 0.4;
  float hz = -0.18;
  if (uv.y < hz) {
    float d = hz - uv.y;
    vec2 gp = vec2(uv.x / max(d, 0.004), 0.5 / max(d, 0.004) - t * 0.9);
    vec2 gf = abs(fract(gp) - 0.5);
    float grid = smoothstep(0.47, 0.499, max(gf.x, gf.y));
    vec3 gridCol = mix(vec3(0.16, 0.88, 1.0), vec3(1.0, 0.22, 0.75), smoothstep(0.4, 0.0, d));
    col += gridCol * grid * smoothstep(0.55, 0.02, d) * 0.9;
    col += gridCol * 0.05 * smoothstep(0.55, 0.0, d);
  }
  float ring = abs(length(uv * vec2(1.0, 1.9)) - 0.42);
  col += vec3(1.0, 0.3, 0.82) * smoothstep(0.012, 0.0, ring) * (0.45 + 0.45 * sin(t * 3.0));
  for (int i = 0; i < 10; i++) {
    float fi = float(i);
    float side = mod(fi, 2.0) < 0.5 ? -1.0 : 1.0;
    float sp = 0.35 + hash(vec2(fi, 2.0)) * 0.5;
    float px = side * (0.14 + 0.4 * hash(vec2(fi, 5.0))) + sin(t * sp + fi) * 0.12;
    float py = -0.34 + hash(vec2(fi, 9.0)) * 0.16 + sin(t * sp * 1.7 + fi * 2.0) * 0.02;
    float d = length((uv - vec2(px, py)) * vec2(1.0, 1.4));
    vec3 fc = side < 0.0 ? vec3(0.25, 0.88, 1.0) : vec3(1.0, 0.36, 0.46);
    col += fc * smoothstep(0.035, 0.0, d) * (0.75 + 0.35 * sin(t * 6.0 + fi));
    col += fc * smoothstep(0.1, 0.02, d) * 0.12;
  }
  float flashT = mod(t * 1.7, 3.0);
  col += vec3(1.0, 0.9, 0.72) * smoothstep(0.18, 0.0, flashT) * e * 0.22;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float bh = 0.04 + 0.2 * abs(sin(t * 1.6 + fi * 1.3)) * (0.4 + e);
    float bx = -0.86 + fi * 0.07;
    float bar = step(abs(uv.x - bx), 0.018) * step(uv.y, -0.02 + bh) * step(-0.34, uv.y);
    col += vec3(0.55, 1.0, 0.78) * bar * 0.55;
  }
  col *= vignette(uv * vec2(0.9, 1.45));
  col += grain(t) * 0.035 + filmGate(t);
  gl_FragColor = vec4(col, 1.0);
}`,
  space: /* glsl */ `
void main(){
  vec2 uv = screenUv();
  float t = uTime;
  vec3 col = vec3(0.005, 0.008, 0.03);
  float n1 = fbm(uv * 1.9 + vec2(t * 0.02, -t * 0.012));
  float n2 = fbm(uv * 4.1 - vec2(t * 0.03, t * 0.01) + 8.0);
  vec3 neb = mix(vec3(0.16, 0.05, 0.46), vec3(0.0, 0.55, 0.8), n1) * (0.5 + 0.95 * n2);
  col += neb * smoothstep(0.12, 0.85, n1) * 0.85;
  for (int l = 0; l < 3; l++) {
    float fl = float(l);
    vec2 sp = uv * (28.0 + fl * 26.0);
    sp.y += t * (2.5 + fl * 3.0);
    vec2 cell = floor(sp);
    vec2 f = fract(sp) - 0.5;
    float h = hash(cell + fl * 13.0);
    float d = length(f);
    float tw = 0.6 + 0.4 * sin(t * 3.0 + h * 30.0);
    col += vec3(0.85, 0.92, 1.0) * smoothstep(0.15, 0.0, d) * step(0.9, h) * tw * (0.5 + fl * 0.3);
  }
  vec2 dp = (uv - vec2(0.6, -0.05)) * vec2(1.0, 1.6);
  float dist = length(dp);
  float disk = smoothstep(0.27, 0.262, dist);
  float shade = smoothstep(-0.22, 0.28, dp.x);
  vec3 pcol = mix(vec3(0.05, 0.045, 0.13), vec3(0.78, 0.46, 0.28), shade);
  pcol += vec3(0.38, 0.2, 0.5) * smoothstep(0.6, 0.2, dist) * 0.5;
  col = mix(col, pcol, disk * 0.95);
  float ring = abs(length(vec2(dp.x * 0.55, dp.y * 2.4)) - 0.34);
  col += vec3(0.9, 0.8, 0.62) * smoothstep(0.012, 0.0, ring) * step(0.0, dp.y + 0.07) * 0.7;
  float sun = smoothstep(0.055, 0.0, length(uv - vec2(-0.74, 0.25)));
  col += vec3(1.0, 0.95, 0.85) * sun * 1.6;
  col += vec3(0.8, 0.85, 1.0) * pow(max(0.0, 1.0 - length(uv - vec2(-0.74, 0.25)) * 3.0), 3.0) * 0.32;
  col *= vignette(uv * vec2(0.95, 1.5));
  col += grain(t) * 0.03 + filmGate(t);
  gl_FragColor = vec4(col, 1.0);
}`,
  dj: /* glsl */ `
void main(){
  vec2 uv = screenUv();
  float t = uTime;
  float e = uEnergy;
  float beat = pow(max(0.0, sin(t * 3.35)), 8.0) * (0.3 + 0.9 * e);
  vec3 col = mix(vec3(0.05, 0.01, 0.12), vec3(0.16, 0.03, 0.24), 1.0 - vUv.y);
  float sd = length((uv - vec2(0.0, 0.06)) * vec2(0.72, 1.0));
  float sun = smoothstep(0.34, 0.32, sd);
  col += mix(vec3(1.0, 0.15, 0.5), vec3(1.0, 0.72, 0.26), smoothstep(-0.3, 0.3, uv.y)) * sun * (0.5 + beat * 0.8);
  float bands = step(0.55, fract((uv.y + 0.4) * 26.0)) * sun * 0.35;
  col -= bands * vec3(0.5, 0.1, 0.4);
  float bx = floor(uv.x * 11.0 + 5.5);
  float bh = 0.1 + hash(vec2(bx, 3.0)) * 0.42;
  float top = -0.46 + bh;
  float inBuilding = step(uv.y, top) * step(-0.5, uv.y) * step(abs(uv.x), 0.98);
  float win = step(0.74, hash(floor(vec2(uv.x * 60.0, uv.y * 28.0)))) * step(0.25, fract(t * 0.4 + hash(vec2(bx, 9.0))));
  vec3 bcol = mix(vec3(0.02, 0.02, 0.06), vec3(0.1, 0.05, 0.2), hash(vec2(bx, 7.0)));
  col = mix(col, bcol, inBuilding);
  col += vec3(0.45, 0.95, 1.0) * win * inBuilding * 0.7;
  col += vec3(1.0, 0.35, 0.88) * smoothstep(0.006, 0.0, abs(uv.y - top)) * step(abs(uv.x), 0.98) * 0.75;
  for (int i = 0; i < 22; i++) {
    float fi = float(i);
    float barX = -0.92 + fi * 0.088;
    float amp = 0.05 + 0.2 * abs(sin(t * 2.1 + fi * 0.7)) * (0.4 + e) + 0.05 * hash(vec2(fi, floor(t * 6.0)));
    float bar = step(abs(uv.x - barX), 0.028) * step(uv.y, -0.42 + amp) * step(-0.5, uv.y);
    col += mix(vec3(0.2, 1.0, 0.9), vec3(1.0, 0.3, 0.9), fi / 22.0) * bar * 1.1;
  }
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float ang = sin(t * 0.6 + fi * 2.1) * 0.9;
    float lx = uv.x * cos(ang) - (uv.y + 0.5) * sin(ang);
    col += mix(vec3(0.4, 1.0, 1.0), vec3(1.0, 0.4, 1.0), fi * 0.4) * smoothstep(0.012, 0.0, abs(lx)) * 0.32 * (0.4 + e);
  }
  col += vec3(1.0, 0.6, 0.9) * beat * 0.14;
  col *= vignette(uv * vec2(0.9, 1.45));
  col += grain(t) * 0.04 + filmGate(t);
  gl_FragColor = vec4(col, 1.0);
}`,
  worldcup: /* glsl */ `
void main(){
  vec2 uv = screenUv();
  float t = uTime;
  float e = uEnergy;
  vec3 col = mix(vec3(0.03, 0.06, 0.1), vec3(0.06, 0.1, 0.16), vUv.y);
  float stand = step(uv.y, 0.17) * step(-0.17, uv.y);
  float dots = step(0.84, hash(floor(vec2(uv.x * 95.0, uv.y * 22.0)))) * stand;
  col += vec3(0.92, 0.86, 0.7) * dots * 0.5 * (0.4 + e);
  col += vec3(0.85, 0.95, 1.0) * pow(max(0.0, 1.0 - length(uv - vec2(-0.84, 0.42)) * 4.0), 4.0) * 0.75;
  col += vec3(0.85, 0.95, 1.0) * pow(max(0.0, 1.0 - length(uv - vec2(0.84, 0.42)) * 4.0), 4.0) * 0.75;
  float hz = -0.17;
  if (uv.y < hz) {
    float d = hz - uv.y;
    float persp = 1.0 / max(d, 0.01);
    vec2 pp = vec2(uv.x * persp * 0.6, persp * 0.5 - t * 0.05);
    float stripe = step(0.5, fract(pp.y * 0.32));
    vec3 grass = mix(vec3(0.055, 0.3, 0.12), vec3(0.09, 0.44, 0.17), stripe);
    col = mix(vec3(0.03, 0.1, 0.06), grass, smoothstep(0.5, 0.02, d));
    float lineX = smoothstep(0.007, 0.0, abs(abs(uv.x / max(d, 0.01) * 0.16) - 0.42));
    col += vec3(0.95) * lineX * smoothstep(0.45, 0.0, d) * 0.45;
  }
  float netMask = step(0.5, uv.x) * step(uv.y, 0.12) * step(-0.42, uv.y);
  float netLines = max(step(0.86, fract(uv.x * 44.0)), step(0.86, fract(uv.y * 44.0)));
  col += vec3(0.9) * netLines * netMask * 0.2;
  float cycle = mod(t, 9.0) / 9.0;
  float ballX = mix(-0.95, 0.6, cycle);
  float ballY = -0.42 + sin(cycle * 3.14159) * 0.56;
  float ball = smoothstep(0.055, 0.042, length((uv - vec2(ballX, ballY)) * vec2(1.0, 1.25)));
  col = mix(col, vec3(0.98), ball);
  col += vec3(1.0, 0.95, 0.7) * smoothstep(0.12, 0.0, length(uv - vec2(ballX, ballY))) * 0.14;
  float board = step(abs(uv.x + 0.72), 0.23) * step(abs(uv.y - 0.3), 0.1);
  col = mix(col, vec3(0.02), board);
  float digits = step(0.62, hash(floor(vec2((uv.x + 0.72) * 90.0, (uv.y - 0.3) * 46.0))));
  col += vec3(1.0, 0.35, 0.35) * digits * board * 0.85;
  float flash = smoothstep(0.86, 1.0, cycle) * e;
  col += vec3(1.0, 1.0, 0.88) * flash * 0.45;
  col *= vignette(uv * vec2(0.9, 1.45));
  col += grain(t) * 0.035 + filmGate(t);
  gl_FragColor = vec4(col, 1.0);
}`,
  cyberpunk: /* glsl */ `
void main(){
  vec2 uv = screenUv();
  float t = uTime;
  float e = uEnergy;
  vec3 col = vec3(0.01, 0.015, 0.045);
  col += vec3(0.1, 0.5, 0.9) * pow(max(0.0, 1.0 - abs(uv.y + 0.2) * 4.0), 3.0) * 0.26;
  float hz = -0.2;
  if (uv.y < hz) {
    float d = hz - uv.y;
    vec2 gp = vec2(uv.x / max(d, 0.006), 0.45 / max(d, 0.006) + t * 0.35);
    vec2 gf = abs(fract(gp) - 0.5);
    float grid = smoothstep(0.46, 0.499, max(gf.x, gf.y));
    col += vec3(0.2, 0.9, 1.0) * grid * smoothstep(0.6, 0.0, d) * 0.65;
  }
  for (int i = 0; i < 20; i++) {
    float fi = float(i);
    float cx = (hash(vec2(fi, 3.0)) - 0.5) * 1.7;
    float sp = 0.25 + hash(vec2(fi, 9.0)) * 0.85;
    float y = mod(hash(vec2(fi, 5.0)) + t * sp, 1.5) - 0.72;
    float d = abs(uv.x - cx);
    float glyph = step(0.45, fract((uv.y + t * 0.4) * 9.0));
    col += mix(vec3(0.9, 0.2, 0.9), vec3(0.2, 1.0, 0.9), hash(vec2(fi, 11.0))) * smoothstep(0.007, 0.0, d) * smoothstep(0.4, 0.02, abs(uv.y - y)) * glyph * 0.85;
  }
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float yc = -0.06 + fi * 0.05;
    float w = sin(uv.x * (5.0 + fi * 1.7) + t * (1.4 + fi * 0.3)) * (0.018 + 0.014 * e);
    float l = smoothstep(0.006, 0.0, abs(uv.y - yc - w));
    col += mix(vec3(0.3, 0.85, 1.0), vec3(0.9, 0.5, 1.0), fi / 5.0) * l * 1.05;
  }
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float r = mod(t * 0.35 + fi * 0.33, 1.0);
    float ring = abs(length(uv * vec2(1.0, 1.6)) - r * 0.7);
    col += vec3(0.6, 0.4, 1.0) * smoothstep(0.01, 0.0, ring) * (1.0 - r) * 0.55;
  }
  float core = smoothstep(0.12, 0.0, length(uv * vec2(1.0, 1.4)));
  col += vec3(0.4, 0.95, 1.0) * core * (0.35 + 0.5 * e) * (0.7 + 0.3 * sin(t * 4.0));
  col *= vignette(uv * vec2(0.9, 1.45));
  col += grain(t) * 0.045 + filmGate(t);
  gl_FragColor = vec4(col, 1.0);
}`,
};

export const SCREEN_VERTEX = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export function screenFragment(id) {
  return PRELUDE + (BODIES[id] || BODIES.esports);
}