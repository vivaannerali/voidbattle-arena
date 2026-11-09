import * as THREE from 'three';

export function textTexture({ width = 1024, height = 1024, draw }) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  draw(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function hexToRgba(hex, alpha) {
  const value = String(hex).replace('#', '');
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export function wrapLines(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function posterTexture(experience, index) {
  return textTexture({
    width: 768,
    height: 1152,
    draw(ctx, w, h) {
      const gradient = ctx.createLinearGradient(0, 0, w * 0.5, h);
      gradient.addColorStop(0, experience.palette[0]);
      gradient.addColorStop(0.55, experience.palette[1]);
      gradient.addColorStop(1, experience.palette[2]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(w * 0.5, h * 0.38, 10, w * 0.5, h * 0.38, w * 0.9);
      glow.addColorStop(0, hexToRgba(experience.accent, 0.5));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = hexToRgba(experience.accent2, 0.2);
      ctx.fillRect(0, h * 0.66, w, 6);

      for (let i = 0; i < 1400; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`;
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }

      ctx.strokeStyle = hexToRgba(experience.accent, 0.8);
      ctx.lineWidth = 5;
      ctx.strokeRect(20, 20, w - 40, h - 40);

      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,255,255,0.72)';
      ctx.font = '500 22px Helvetica Neue, Arial, sans-serif';
      ctx.fillText(`PRESENTATION ${index + 1} · IMAX 70MM`, w / 2, 96);

      const titleFont = '800 62px Helvetica Neue, Arial, sans-serif';
      ctx.font = titleFont;
      const titleLines = wrapLines(ctx, experience.marquee, w - 150);
      ctx.fillStyle = '#ffffff';
      titleLines.forEach((line, i) => ctx.fillText(line, w / 2, h * 0.42 + i * 70));

      ctx.font = '600 32px Helvetica Neue, Arial, sans-serif';
      const tagLines = wrapLines(ctx, experience.tagline, w - 180);
      ctx.fillStyle = experience.accent;
      const tagTop = h * 0.42 + titleLines.length * 70 + 44;
      tagLines.forEach((line, i) => ctx.fillText(line, w / 2, tagTop + i * 40));

      ctx.font = '400 24px Helvetica Neue, Arial, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.62)';
      const blurb = wrapLines(ctx, experience.kind, w - 200);
      blurb.forEach((line, i) => ctx.fillText(line, w / 2, tagTop + tagLines.length * 40 + 44 + i * 32));

      ctx.fillStyle = 'rgba(0,0,0,0.46)';
      ctx.fillRect(60, h - 190, w - 120, 108);
      ctx.strokeStyle = hexToRgba(experience.accent, 0.9);
      ctx.lineWidth = 3;
      ctx.strokeRect(60, h - 190, w - 120, 108);
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 32px Helvetica Neue, Arial, sans-serif';
      ctx.fillText('ENTER EXPERIENCE', w / 2, h - 142);
      ctx.fillStyle = hexToRgba(experience.accent, 0.9);
      ctx.font = '500 21px Helvetica Neue, Arial, sans-serif';
      ctx.fillText('CLICK TO BEGIN', w / 2, h - 110);

      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      for (let y = 44; y < h - 44; y += 62) {
        ctx.fillRect(7, y, 11, 24);
        ctx.fillRect(w - 18, y, 11, 24);
      }
    },
  });
}

export function menuTexture(snacks) {
  return textTexture({
    width: 1024,
    height: 512,
    draw(ctx, w, h) {
      ctx.fillStyle = '#0a090c';
      ctx.fillRect(0, 0, w, h);
      const glow = ctx.createRadialGradient(w / 2, -60, 20, w / 2, -60, h * 1.4);
      glow.addColorStop(0, 'rgba(217,171,90,0.35)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#d9ab5a';
      ctx.lineWidth = 6;
      ctx.strokeRect(20, 20, w - 40, h - 40);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f6dda4';
      ctx.font = '800 62px Helvetica Neue, Arial, sans-serif';
      ctx.fillText('C A N D Y   B A R', w / 2, 116);
      ctx.fillStyle = 'rgba(246,221,164,0.62)';
      ctx.font = '500 25px Helvetica Neue, Arial, sans-serif';
      ctx.fillText('EVERY ITEM · EVERY SIZE · $0.00 · PREMIUM FREE PASS', w / 2, 160);

      const half = Math.ceil(snacks.length / 2);
      ctx.textAlign = 'left';
      snacks.forEach((snack, index) => {
        const column = index < half ? 0 : 1;
        const row = index % half;
        const x = 78 + column * (w / 2 - 10);
        const y = 246 + row * 52;
        ctx.fillStyle = '#f4efe6';
        ctx.font = '600 30px Helvetica Neue, Arial, sans-serif';
        ctx.fillText(snack.name, x, y);
        ctx.fillStyle = '#8ce99a';
        ctx.font = '700 28px Helvetica Neue, Arial, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('$0.00', x + w / 2 - 190, y);
        ctx.textAlign = 'left';
      });

      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(246,221,164,0.5)';
      ctx.font = '500 22px Helvetica Neue, Arial, sans-serif';
      ctx.fillText('CLICK ANY ITEM ON THE COUNTER TO COLLECT IT', w / 2, h - 44);
    },
  });
}

export function signTexture(title, subtitle, color) {
  return textTexture({
    width: 1024,
    height: 256,
    draw(ctx, w, h) {
      ctx.fillStyle = 'rgba(6,5,9,0.92)';
      ctx.fillRect(0, 0, w, h);
      const glow = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.7);
      glow.addColorStop(0, hexToRgba(color, 0.4));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      ctx.textAlign = 'center';
      ctx.shadowColor = color;
      ctx.shadowBlur = 26;
      ctx.fillStyle = '#fff8ec';
      ctx.font = '800 92px Helvetica Neue, Arial, sans-serif';
      ctx.fillText(title, w / 2, h / 2 + 12);
      ctx.shadowBlur = 0;
      ctx.fillStyle = hexToRgba(color, 0.92);
      ctx.font = '500 28px Helvetica Neue, Arial, sans-serif';
      ctx.fillText(subtitle, w / 2, h - 32);
    },
  });
}

export function disposeTree(root) {
  root.traverse((object) => {
    if (object.geometry) object.geometry.dispose();
    if (object.material) {
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        Object.values(material).forEach((value) => {
          if (value && value.isTexture) value.dispose();
        });
        material.dispose();
      });
    }
  });
}