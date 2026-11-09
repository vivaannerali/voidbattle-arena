import theatreAmbience from '@/cinema/theatreAmbience';

// Original synthesised cinema audio: Web Audio spatial speaker buses (5.1 where the device
// supports six channels, stereo downmix otherwise), generative scores, crowd beds and cues.
const SPEAKERS = [
  { key: 'L', angle: -30 },
  { key: 'R', angle: 30 },
  { key: 'C', angle: 0 },
  { key: 'LS', angle: -110 },
  { key: 'RS', angle: 110 },
  { key: 'LFE', angle: 0 },
];
const CHANNEL_ORDER = ['L', 'R', 'C', 'LFE', 'LS', 'RS'];
const BUS_ANGLES = [-110, -70, -35, 0, 35, 70, 110];

const MUSIC = {
  esports: { bpm: 138, root: 43, chords: [[0, 3, 7], [-2, 1, 5], [3, 7, 10], [-4, 0, 3]], lead: 'square', pad: 'sawtooth', bass: [0, 0, -5, -5, 3, 3, -2, -2], arp: [0, 7, 12, 7, 3, 10, 15, 10], perc: 0.8 },
  space: { bpm: 62, root: 34, chords: [[0, 7, 12], [-5, 2, 7], [-3, 4, 9], [-8, -1, 4]], lead: 'sine', pad: 'sine', bass: [0, 0, 0, 0, -5, -5, -3, -3], arp: [0, 12, 19, 24, 19, 12, 0, 12], perc: 0.1 },
  dj: { bpm: 128, root: 38, chords: [[0, 7, 12], [-2, 5, 10], [-4, 3, 8], [-5, 2, 7]], lead: 'sawtooth', pad: 'square', bass: [0, 0, 0, 0, -2, -2, -2, -2], arp: [0, 5, 7, 12, 10, 7, 5, 0], perc: 1 },
  worldcup: { bpm: 96, root: 41, chords: [[0, 4, 7], [-3, 2, 5], [-5, 0, 4], [2, 6, 9]], lead: 'triangle', pad: 'triangle', bass: [0, 0, -5, -5, 2, 2, -3, -3], arp: [0, 4, 7, 12, 11, 7, 4, 0], perc: 0.55 },
  cyberpunk: { bpm: 112, root: 36, chords: [[0, 6, 11], [-1, 5, 10], [2, 8, 13], [-3, 3, 8]], lead: 'triangle', pad: 'sawtooth', bass: [0, 0, 0, -3, -3, -1, -1, -5], arp: [0, 6, 11, 18, 13, 11, 6, 0], perc: 0.7 },
};

const midi = (note) => 440 * Math.pow(2, (note - 69) / 12);

function softCurve() {
  const length = 1024;
  const curve = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const x = (i / (length - 1)) * 2 - 1;
    const a = Math.abs(x);
    const y = a < 0.7 ? a : 0.7 + (1 - Math.exp(-(a - 0.7) * 4)) * 0.3;
    curve[i] = Math.sign(x) * Math.min(1, y);
  }
  return curve;
}

export function createCinemaAudio() {
  let ctx = null;
  let mix = null;
  let musicBus = null;
  let master = null;
  let reverb = null;
  let reverbSend = null;
  let lfeIn = null;
  let surround = false;
  let buses = null;
  let crowd = null;
  let musicTimer = null;
  let nextNoteAt = 0;
  let step = 0;
  let cfg = null;
  let mode = 'lobby';
  let excitement = 0.15;
  let buffers = {};
  let alive = true;
  let room = null;
  let videoNodes = [];

  function noise(seconds = 2) {
    const key = `n${seconds}`;
    if (buffers[key]) return buffers[key];
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.2 + white * 0.35;
      }
    }
    buffers[key] = buffer;
    return buffer;
  }

  function impulse(seconds, decay) {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay) * (i < 220 ? i / 220 : 1);
      }
    }
    return buffer;
  }

  function busFor(angle) {
    if (!buses) return null;
    let best = BUS_ANGLES[0];
    let distance = 999;
    for (const candidate of BUS_ANGLES) {
      const d = Math.abs(candidate - angle);
      if (d < distance) { distance = d; best = candidate; }
    }
    return buses.get(best);
  }

  function ensure() {
    if (!alive) return null;
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC({ latencyHint: 'interactive' });

    mix = ctx.createGain();
    mix.gain.value = 0.9;
    musicBus = ctx.createGain();
    musicBus.gain.value = 1;
    musicBus.connect(mix);
    master = ctx.createGain();
    master.gain.value = 0.9;
    reverb = ctx.createConvolver();
    reverb.buffer = impulse(2.2, 2.6);
    reverbSend = ctx.createGain();
    reverbSend.gain.value = 0.24;
    mix.connect(reverbSend);
    reverbSend.connect(reverb);

    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -13;
    limiter.knee.value = 8;
    limiter.ratio.value = 9;
    limiter.attack.value = 0.004;
    limiter.release.value = 0.26;

    const speaker = {};
    const shaper = {};
    const curve = softCurve();
    for (const item of SPEAKERS) {
      speaker[item.key] = ctx.createGain();
      shaper[item.key] = ctx.createWaveShaper();
      shaper[item.key].curve = curve;
      speaker[item.key].connect(shaper[item.key]);
    }

    const maxChannels = ctx.destination.maxChannelCount || 2;
    surround = maxChannels >= 6;
    if (surround) {
      try {
        ctx.destination.channelCount = 6;
        ctx.destination.channelCountMode = 'explicit';
        ctx.destination.channelInterpretation = 'discrete';
      } catch (error) { /* some devices refuse discrete routing; the merger still downmixes */ }
      const merger = ctx.createChannelMerger(6);
      CHANNEL_ORDER.forEach((key, index) => shaper[key].connect(merger, 0, index));
      reverb.connect(merger, 0, 0);
      reverb.connect(merger, 0, 1);
      merger.connect(master);
      master.connect(ctx.destination);
    } else {
      const left = ctx.createGain();
      const right = ctx.createGain();
      shaper.L.connect(left);
      shaper.R.connect(right);
      const centre = ctx.createGain();
      centre.gain.value = 0.707;
      shaper.C.connect(centre);
      centre.connect(left);
      centre.connect(right);
      const leftSurround = ctx.createGain();
      leftSurround.gain.value = 0.85;
      shaper.LS.connect(leftSurround);
      leftSurround.connect(left);
      const rightSurround = ctx.createGain();
      rightSurround.gain.value = 0.85;
      shaper.RS.connect(rightSurround);
      rightSurround.connect(right);
      const lowLeft = ctx.createGain();
      const lowRight = ctx.createGain();
      lowLeft.gain.value = 0.55;
      lowRight.gain.value = 0.55;
      shaper.LFE.connect(lowLeft);
      lowLeft.connect(left);
      shaper.LFE.connect(lowRight);
      lowRight.connect(right);
      const merger = ctx.createChannelMerger(2);
      left.connect(merger, 0, 0);
      right.connect(merger, 0, 1);
      reverb.connect(merger, 0, 0);
      reverb.connect(merger, 0, 1);
      merger.connect(limiter);
      limiter.connect(master);
      master.connect(ctx.destination);
    }

    buses = new Map();
    for (const angle of BUS_ANGLES) {
      const bus = ctx.createGain();
      const weights = {};
      let energy = 0;
      for (const item of SPEAKERS) {
        if (item.key === 'LFE') continue;
        const w = Math.max(0, Math.cos(((angle - item.angle) * Math.PI) / 180));
        weights[item.key] = w * w;
        energy += w * w * w * w;
      }
      const norm = 1 / Math.sqrt(energy || 1);
      for (const item of SPEAKERS) {
        if (item.key === 'LFE') continue;
        const value = (weights[item.key] || 0) * norm;
        if (value < 0.0005) continue;
        const gain = ctx.createGain();
        gain.gain.value = value;
        bus.connect(gain);
        gain.connect(speaker[item.key]);
      }
      buses.set(angle, bus);
    }

    lfeIn = ctx.createGain();
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 110;
    lfeIn.connect(lowpass);
    lowpass.connect(speaker.LFE);
    lfeIn.connect(busFor(0));

    room = theatreAmbience(ctx, master);
    mix.connect(room.input);
    startCrowd();
    return ctx;
  }

  function tone({ at, freq, dur, type = 'sine', gain = 0.14, angle = 0, sweep = 0, attack = 0.01, bass = false, target = musicBus }) {
    if (!ctx) return;
    const t0 = at ?? ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (sweep) osc.frequency.exponentialRampToValueAtTime(Math.max(18, sweep), t0 + dur * 0.95);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    const bus = busFor(angle);
    if (bus) g.connect(bus);
    if (bass && lfeIn) g.connect(lfeIn);
    if (target) g.connect(target);
    osc.start(t0);
    osc.stop(t0 + dur + 0.06);
  }

  function burst({ at, dur = 0.3, gain = 0.18, freq = 1200, q = 1, type = 'bandpass', angle = 0, attack = 0.006, sweep = 0, target = musicBus }) {
    if (!ctx) return;
    const t0 = at ?? ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noise(2);
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(freq, t0);
    filter.Q.value = q;
    if (sweep) filter.frequency.exponentialRampToValueAtTime(Math.max(40, sweep), t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filter);
    filter.connect(g);
    const bus = busFor(angle);
    if (bus) g.connect(bus);
    if (target) g.connect(target);
    src.start(t0, Math.random() * 1.2);
    src.stop(t0 + dur + 0.06);
  }

  function startCrowd() {
    if (crowd || !ctx) return;
    const src = ctx.createBufferSource();
    src.buffer = noise(3);
    src.loop = true;
    const low = ctx.createBiquadFilter();
    low.type = 'bandpass';
    low.frequency.value = 520;
    low.Q.value = 0.6;
    const high = ctx.createBiquadFilter();
    high.type = 'bandpass';
    high.frequency.value = 2100;
    high.Q.value = 0.9;
    const lowGain = ctx.createGain();
    lowGain.gain.value = 0.02;
    const highGain = ctx.createGain();
    highGain.gain.value = 0.005;
    src.connect(low);
    low.connect(lowGain);
    lowGain.connect(busFor(-70));
    src.connect(high);
    high.connect(highGain);
    highGain.connect(busFor(70));
    src.start();
    crowd = { src, lowGain, highGain };
  }

  function schedule() {
    if (!ctx || !cfg) return;
    const stepDur = 30 / cfg.bpm;
    while (nextNoteAt < ctx.currentTime + 0.3) {
      playStep(step, nextNoteAt, stepDur);
      step = (step + 1) % 8;
      nextNoteAt += stepDur;
    }
  }

  function playStep(index, at, stepDur) {
    const chord = cfg.chords[Math.floor(index / 2) % cfg.chords.length];
    if (index % 2 === 0) {
      tone({ at, freq: midi(cfg.root + cfg.bass[index]), dur: stepDur * 1.9, type: 'sine', gain: 0.2, bass: true, attack: 0.02, angle: 0 });
      burst({ at, dur: 0.1, gain: 0.03 + cfg.perc * 0.05, freq: 150, q: 1.1, type: 'lowpass', angle: 0 });
    }
    if (cfg.perc > 0.25 && index % 4 === 2) {
      burst({ at, dur: 0.16, gain: 0.02 + cfg.perc * 0.06, freq: 2600, q: 0.7, type: 'highpass', angle: 15 });
    }
    if (index === 0) {
      chord.forEach((offset, i) => tone({ at, freq: midi(cfg.root + 12 + offset), dur: stepDur * 7.2, type: cfg.pad, gain: 0.03, attack: 0.55, angle: i === 0 ? -35 : i === 1 ? 0 : 35 }));
    }
    tone({ at, freq: midi(cfg.root + 24 + chord[0] + cfg.arp[index]), dur: stepDur * 0.85, type: cfg.lead, gain: 0.035, attack: 0.008, angle: ((index % 4) - 1.5) * 35 });
  }

  function startMusic(expId) {
    if (!ensure()) return;
    stopMusic();
    cfg = MUSIC[expId] || MUSIC.esports;
    step = 0;
    nextNoteAt = ctx.currentTime + 0.15;
    musicTimer = setInterval(schedule, 45);
  }

  function stopMusic() {
    if (musicTimer) window.clearInterval(musicTimer);
    musicTimer = null;
    cfg = null;
  }

  function cheer(intensity = 1) {
    if (!ctx) return;
    const t = ctx.currentTime;
    burst({ at: t, dur: 1.5, gain: 0.18 * intensity, freq: 1100, q: 0.5, angle: -55, attack: 0.14 });
    burst({ at: t + 0.06, dur: 1.7, gain: 0.16 * intensity, freq: 1500, q: 0.5, angle: 55, attack: 0.18 });
    burst({ at: t, dur: 0.55, gain: 0.09 * intensity, freq: 700, q: 0.4, angle: 0, attack: 0.08 });
    for (let i = 0; i < 9; i++) {
      burst({ at: t + Math.random() * 1.15, dur: 0.07, gain: 0.02 + Math.random() * 0.03, freq: 2600 + Math.random() * 1600, q: 2, angle: Math.random() * 200 - 100, attack: 0.002 });
    }
  }

  function gasp() {
    if (!ctx) return;
    const t = ctx.currentTime;
    burst({ at: t, dur: 0.8, gain: 0.15, freq: 520, q: 1.4, angle: 0, attack: 0.16, sweep: 900 });
    burst({ at: t + 0.05, dur: 0.5, gain: 0.06, freq: 1600, q: 1, angle: -60, attack: 0.12 });
    if (crowd) {
      const param = crowd.lowGain.gain;
      param.cancelScheduledValues(t);
      param.setValueAtTime(param.value, t);
      param.linearRampToValueAtTime(0.004, t + 0.2);
      param.linearRampToValueAtTime(0.03, t + 1.5);
    }
  }

  function cue(mood) {
    if (!ensure()) return;
    if (mode !== 'auditorium') return;
    if (mood === 'cheer') cheer(0.85);
    else if (mood === 'hype') { cheer(1); impact(); }
    else if (mood === 'gasp') gasp();
    else if (mood === 'tense') tone({ at: ctx.currentTime, freq: 62, dur: 3.4, type: 'sine', gain: 0.11, bass: true, attack: 0.7 });
    else burst({ at: ctx.currentTime, dur: 1.6, gain: 0.03, freq: 420, q: 0.5, attack: 0.5 });
  }

  function impact() {
    if (!ctx) return;
    const t = ctx.currentTime;
    tone({ at: t, freq: 130, dur: 1.1, type: 'sine', gain: 0.34, sweep: 32, bass: true, attack: 0.005 });
    burst({ at: t, dur: 0.85, gain: 0.12, freq: 900, q: 0.6, attack: 0.01, sweep: 280 });
  }

  // Uploaded video audio runs through the same speaker graph as the procedural
  // mix: centre-weighted front stage, an LFE low-pass and hall reverb.
  function detachVideo() {
    videoNodes.forEach((node) => {
      try { node.disconnect(); } catch (error) { /* already detached */ }
    });
    videoNodes = [];
  }

  function attachVideo(element) {
    if (!ensure() || !element) return false;
    detachVideo();
    let source;
    try { source = ctx.createMediaElementSource(element); } catch (error) { return false; }
    const gain = ctx.createGain();
    gain.gain.value = 0.95;
    const front = busFor(0);
    const low = ctx.createBiquadFilter();
    low.type = 'lowpass';
    low.frequency.value = 110;
    const send = ctx.createGain();
    send.gain.value = 0.16;
    source.connect(gain);
    if (front) gain.connect(front);
    gain.connect(low);
    if (lfeIn) low.connect(lfeIn);
    gain.connect(send);
    send.connect(reverb);
    videoNodes = [source, gain, low, send];
    return true;
  }

  return {
    attachVideo,
    detachVideo,
    resume() {
      const audio = ensure();
      if (!audio) return 'none';
      if (audio.state === 'suspended') audio.resume();
      startCrowd();
      return surround ? '5.1' : 'stereo';
    },
    followView(camera) { room?.follow(camera); },
    format() {
      if (!ctx) return 'pending';
      return surround ? '5.1' : 'stereo';
    },
    setMode(next) {
      mode = next;
      if (!ensure()) return;
      room?.setActive(next === 'auditorium');
      excitement = next === 'auditorium' ? excitement : 0.2;
      applyCrowd();
    },
    startExperience(experience) {
      if (!ensure()) return;
      mode = 'auditorium';
      startMusic(experience.score || experience.id);
      tone({ at: ctx.currentTime, freq: 180, dur: 1.6, type: 'sine', gain: 0.18, sweep: 60, bass: true, attack: 0.02 });
    },
    stopExperience() {
      stopMusic();
    },
    setMood(next) {
      excitement = next.excitement ?? 0.2;
      if (ctx) applyCrowd();
    },
    cue,
    purchase() {
      if (!ensure()) return;
      const t = ctx.currentTime;
      tone({ at: t, freq: 1046, dur: 0.14, type: 'triangle', gain: 0.13, angle: 20 });
      tone({ at: t + 0.09, freq: 1568, dur: 0.3, type: 'triangle', gain: 0.11, angle: 0 });
      tone({ at: t + 0.02, freq: 523, dur: 0.09, type: 'square', gain: 0.025, angle: -10 });
      burst({ at: t, dur: 0.06, gain: 0.07, freq: 3200, q: 1.2, angle: -25 });
    },
    eat(snack) {
      if (!ensure()) return;
      const t = ctx.currentTime;
      if (snack?.kind === 'drink') {
        burst({ at: t, dur: 0.5, gain: 0.1, freq: 900, q: 2.2, angle: 0, attack: 0.05, sweep: 380 });
        tone({ at: t + 0.1, freq: 240, dur: 0.32, type: 'sine', gain: 0.045, sweep: 130 });
        burst({ at: t + 0.36, dur: 0.3, gain: 0.05, freq: 4200, q: 1.4, type: 'highpass', angle: 0 });
        return;
      }
      for (let i = 0; i < 4; i++) {
        burst({ at: t + i * 0.11 + Math.random() * 0.04, dur: 0.09, gain: 0.08, freq: 1400 + Math.random() * 2200, q: 1.6, angle: (Math.random() - 0.5) * 40, attack: 0.002 });
      }
    },
    duck(on) {
      if (!ctx || !master) return;
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(on ? 0.42 : 0.9, t + 0.32);
    },
    dispose() {
      alive = false;
      detachVideo();
      room?.dispose(); room = null;
      stopMusic();
      if (crowd) {
        try { crowd.src.stop(); } catch (error) { /* already stopped */ }
        crowd = null;
      }
      if (ctx) {
        try { ctx.close(); } catch (error) { /* already closed */ }
      }
      ctx = null;
      buses = null;
    },
  };

  function applyCrowd() {
    if (!crowd) return;
    const t = ctx.currentTime;
    const loud = mode === 'auditorium' ? 0.022 + excitement * 0.15 : 0.014;
    const hiss = mode === 'auditorium' ? 0.005 + excitement * 0.05 : 0.003;
    crowd.lowGain.gain.cancelScheduledValues(t);
    crowd.lowGain.gain.setTargetAtTime(loud, t, 0.4);
    crowd.highGain.gain.cancelScheduledValues(t);
    crowd.highGain.gain.setTargetAtTime(hiss, t, 0.5);
  }
}