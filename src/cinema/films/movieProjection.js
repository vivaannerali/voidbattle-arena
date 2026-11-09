import * as THREE from 'three';
import movieWorld from '@/cinema/films/movieWorld';
import movieActor from '@/cinema/films/movieActor';
import movieDirection from '@/cinema/films/movieDirection';
import movieFrame from '@/cinema/films/movieFrame';
import { EXPERIENCES } from '@/cinema/cinemaContent';
import { textTexture, wrapLines } from '@/cinema/three/sceneKit';

export default function movieProjection() {
  const world = movieWorld(), camera = new THREE.PerspectiveCamera(48, 2.72, .1, 150);
  const target = new THREE.WebGLRenderTarget(1632, 600);
  target.texture.repeat.x = -1; target.texture.offset.x = 1;
  const cast = ['Ephirisi', 'Larp108', 'AKD23'].map(movieActor);
  cast.forEach(actor => world.scene.add(actor.root));
  world.scene.add(camera);
  const caption = new THREE.Mesh(new THREE.PlaneGeometry(9.6, .62), new THREE.MeshBasicMaterial({ transparent: true, depthTest: false }));
  caption.position.set(0, -1.45, -4); caption.renderOrder = 100; camera.add(caption);
  const frame = movieFrame(camera);
  let film = EXPERIENCES[0], actors = cast, previous = -1;
  const title = (index) => {
    caption.material.map?.dispose();
    caption.material.map = textTexture({ width: 1536, height: 128, draw(ctx, w, h) {
      ctx.fillStyle = 'rgba(0,0,0,.75)'; ctx.fillRect(0, 0, w, h);
      ctx.textAlign = 'center'; ctx.fillStyle = film.accent; ctx.font = 'bold 30px monospace';
      ctx.fillText(film.marquee, w / 2, 35);
      ctx.fillStyle = '#ffffff'; ctx.font = '25px sans-serif';
      wrapLines(ctx, film.shots[index][1], w - 80).slice(0, 2).forEach((line, i) => ctx.fillText(line, w / 2, 75 + i * 30));
    } }); caption.material.needsUpdate = true;
  };
  return { texture: target.texture,
    setFilm(next) {
      film = next; previous = -1;
      actors = [cast[['Ephirisi', 'Larp108', 'AKD23'].indexOf(next.hero)], cast[['Ephirisi', 'Larp108', 'AKD23'].indexOf(next.rival)]];
      actors.push(cast.find(actor => !actors.includes(actor)));
      world.scene.background.set(next.id === 'akd-origin' ? '#281b2b' : next.id === 'larp-origin' ? '#14273d' : '#24354c');
      world.scene.fog.color.copy(world.scene.background);
    },
    update(time) {
      const index = movieDirection(world, actors, camera, film, time); frame(time);
      if (index !== previous) { title(index); previous = index; }
    },
    render(renderer) { const old = renderer.getRenderTarget(); renderer.setRenderTarget(target); renderer.render(world.scene, camera); renderer.setRenderTarget(old); },
    dispose() {
      target.dispose(); cast.forEach(actor => actor.dispose()); caption.material.map?.dispose();
      const geometries = new Set(), materials = new Set();
      world.scene.traverse(object => { if (object.geometry) geometries.add(object.geometry); if (object.material) materials.add(object.material); });
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
    },
  };
}