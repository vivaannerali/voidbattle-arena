import { SPEAKER_POSITIONS } from '@/cinema/theatreFormat';

// Twelve virtual HRTF positions, not a claim of twelve physical output channels.
export default function theatreAmbience(ctx, output) {
  const input = ctx.createGain(), gate = ctx.createGain(), nodes = [input, gate]; gate.gain.value = 0; gate.connect(output);
  const spatial = position => {
    const pan = ctx.createPanner(); pan.panningModel = 'HRTF'; pan.distanceModel = 'inverse'; pan.refDistance = 14; pan.rolloffFactor = .5;
    pan.positionX.value = position[0]; pan.positionY.value = position[1]; pan.positionZ.value = position[2];
    nodes.push(pan); return pan;
  };
  SPEAKER_POSITIONS.forEach((position, index) => {
    const pan = spatial(position), delay = ctx.createDelay(.1), level = ctx.createGain();
    delay.delayTime.value = .009 + index * .0013; level.gain.value = .018;
    input.connect(delay); delay.connect(level); level.connect(pan); pan.connect(gate); nodes.push(delay, level);
  });
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / ctx.sampleRate, shutter = Math.pow(Math.max(0, Math.sin(t * 24 * Math.PI * 2)), 12);
    data[i] = Math.sin(t * 48 * Math.PI * 2) * .08 + (Math.random() * 2 - 1) * shutter * .16;
  }
  const projector = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain(), pan = spatial([0, 15, 12]);
  projector.buffer = buffer; projector.loop = true; filter.type = 'lowpass'; filter.frequency.value = 700; gain.gain.value = .055;
  projector.connect(filter); filter.connect(gain); gain.connect(pan); pan.connect(gate); projector.start(); nodes.push(projector, filter, gain);
  return { input,
    setActive(active) { gate.gain.setTargetAtTime(active ? 1 : 0, ctx.currentTime, .35); },
    follow(camera) {
      const listener = ctx.listener, m = camera.matrixWorld.elements, p = camera.position;
      if (!listener.positionX) return;
      [listener.positionX.value, listener.positionY.value, listener.positionZ.value] = [p.x, p.y, p.z];
      [listener.forwardX.value, listener.forwardY.value, listener.forwardZ.value] = [-m[8], -m[9], -m[10]];
      [listener.upX.value, listener.upY.value, listener.upZ.value] = [m[4], m[5], m[6]];
    },
    dispose() { projector.stop(); nodes.forEach(node => node.disconnect()); },
  };
}