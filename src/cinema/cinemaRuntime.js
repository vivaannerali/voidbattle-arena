import { MOOD_ENERGY } from '@/cinema/cinemaContent';

const SUBTITLE_HOLD = 6.4;

export default class CinemaRuntime {
  constructor(experience, handlers) {
    this.experience = experience;
    this.onSubtitle = handlers.onSubtitle;
    this.speak = handlers.speak;
    this.onCue = handlers.onCue;
    this.elapsed = 0;
    this.excitement = 0.1;
    this.gasp = 0;
    this.mood = 'quiet';
    this.target = 0.3;
    this.resetCursors();
  }

  resetCursors() {
    this.subIndex = 0;
    this.narIndex = 0;
    this.cueIndex = 0;
    this.subtitleUntil = 0;
  }

  loop() {
    this.elapsed -= this.experience.duration;
    this.resetCursors();
    this.onSubtitle?.(null);
  }

  update(dt) {
    this.elapsed += dt;
    if (this.elapsed >= this.experience.duration) this.loop();
    if (this.elapsed < 0) this.elapsed = 0;
    const t = this.elapsed;
    const experience = this.experience;

    while (this.subIndex < experience.subtitles.length && experience.subtitles[this.subIndex].t <= t) {
      const line = experience.subtitles[this.subIndex++];
      this.subtitleUntil = Math.min(line.t + SUBTITLE_HOLD, experience.duration - 0.4);
      this.onSubtitle?.(line.text);
    }
    if (this.subtitleUntil && t > this.subtitleUntil) {
      this.subtitleUntil = 0;
      this.onSubtitle?.(null);
    }

    while (this.narIndex < experience.narration.length && experience.narration[this.narIndex].t <= t) {
      const line = experience.narration[this.narIndex++];
      this.speak?.(line.text);
    }

    while (this.cueIndex < experience.cues.length && experience.cues[this.cueIndex].t <= t) {
      const cue = experience.cues[this.cueIndex++];
      this.applyCue(cue);
    }

    this.gasp = Math.max(0, this.gasp - dt * 1.15);
    this.excitement += (this.target - this.excitement) * Math.min(1, dt * 1.8);
  }

  applyCue(cue) {
    this.mood = cue.mood;
    this.target = MOOD_ENERGY[cue.mood] ?? 0.4;
    if (cue.mood === 'gasp') this.gasp = 1;
    this.onCue?.(cue);
  }

  dispose() {
    this.onSubtitle?.(null);
  }
}