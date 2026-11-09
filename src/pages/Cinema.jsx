import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CinemaStage from '@/components/cinema/CinemaStage';
import CinemaHud from '@/components/cinema/CinemaHud';
import MovieToolbar from '@/components/cinema/MovieToolbar';
import SubtitleTrack from '@/components/cinema/SubtitleTrack';
import HoverTag from '@/components/cinema/HoverTag';
import SeatPicker from '@/components/cinema/SeatPicker';
import { DEFAULT_SEAT } from '@/cinema/seatLayout';
import CinemaRuntime from '@/cinema/cinemaRuntime';
import { createCinemaAudio } from '@/cinema/cinemaAudio';
import { createNarrator } from '@/cinema/cinemaNarration';
import { readCinemaProfile, saveCinemaProfile } from '@/cinema/cinemaProfile';
import { experienceById } from '@/cinema/cinemaContent';
import { snackById } from '@/cinema/snacks';
import '@/components/cinema/cinema.css';

export default function Cinema() {
  const [ticket, setTicket] = useState(null);
  const [held, setHeld] = useState([]);
  const [mode, setMode] = useState('lobby');
  const [experience, setExperience] = useState(null);
  const [notice, setNotice] = useState('');
  const [subtitle, setSubtitle] = useState(null);
  const [subtitlesOn, setSubtitlesOn] = useState(true);
  const [narration, setNarration] = useState(78);
  const [hover, setHover] = useState(null);
  const [entering, setEntering] = useState(false);
  const [seat, setSeat] = useState(DEFAULT_SEAT);
  const [pickingSeat, setPickingSeat] = useState(false);
  const [video, setVideo] = useState(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const fileInputRef = useRef(null);
  const videoElRef = useRef(null);
  const audioRef = useRef(null);
  const narratorRef = useRef(null);
  const runtimeRef = useRef(null);
  const profileRef = useRef(null);
  const modeRef = useRef('lobby');
  const aliveRef = useRef(true);
  const noticeTimer = useRef(0);

  modeRef.current = mode;

  useEffect(() => {
    aliveRef.current = true;
    const profile = readCinemaProfile();
    profileRef.current = profile;
    setTicket(profile.ticket);
    setHeld(profile.snacks);
    document.title = 'IMAX 70mm Ultimate Arena';
    return () => {
      aliveRef.current = false;
    };
  }, []);

  useEffect(() => {
    const audio = createCinemaAudio();
    audioRef.current = audio;
    const narrator = createNarrator({
      onStart: () => audio.duck(true),
      onEnd: () => audio.duck(false),
    });
    narratorRef.current = narrator;
    const unlock = () => {
      audio.resume();
      audio.setMode(modeRef.current);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      narrator.cancel();
      audio.dispose();
      narratorRef.current = null;
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    narratorRef.current?.setVolume(narration / 100);
  }, [narration]);

  useEffect(() => {
    audioRef.current?.setMode(mode);
    if (mode !== 'auditorium') audioRef.current?.stopExperience();
  }, [mode]);

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  const flash = useCallback((message) => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => {
      if (aliveRef.current) setNotice('');
    }, 3600);
  }, []);

  const persist = useCallback((snacks) => {
    if (profileRef.current) saveCinemaProfile({ ticket: profileRef.current.ticket, snacks });
  }, []);

  const buySnack = useCallback((id) => {
    const snack = snackById(id);
    if (!snack) return;
    setHeld((current) => {
      const next = [...current, id].slice(-20);
      persist(next);
      return next;
    });
    audioRef.current?.purchase();
    flash('Snack purchased! Cost: $0.00.');
  }, [flash, persist]);

  const eatSnack = useCallback((id) => {
    const snack = snackById(id);
    if (!snack) return;
    setHeld((current) => {
      const index = current.lastIndexOf(id);
      if (index < 0) return current;
      const next = current.filter((_, position) => position !== index);
      persist(next);
      return next;
    });
    audioRef.current?.eat(snack);
    flash(snack.bite);
  }, [flash, persist]);

  const stopPlayback = useCallback(() => {
    const runtime = runtimeRef.current;
    runtimeRef.current = null;
    runtime?.dispose();
    narratorRef.current?.cancel();
    audioRef.current?.stopExperience();
    setSubtitle(null);
    setEntering(false);
  }, []);

  const clearVideo = useCallback(() => {
    const element = videoElRef.current;
    videoElRef.current = null;
    if (element) {
      const source = element.src;
      element.pause();
      audioRef.current?.detachVideo();
      element.removeAttribute('src');
      element.load();
      if (source.startsWith('blob:')) URL.revokeObjectURL(source);
    }
    setVideo(null);
    setVideoPlaying(false);
  }, []);

  const loadVideo = useCallback((file) => {
    if (!file) return;
    stopPlayback();
    const previous = videoElRef.current;
    const element = document.createElement('video');
    element.src = URL.createObjectURL(file);
    element.loop = true;
    element.playsInline = true;
    element.preload = 'auto';
    element.addEventListener('loadedmetadata', () => {
      if (aliveRef.current) flash(`70mm presentation loaded · ${element.videoWidth}×${element.videoHeight}`);
    }, { once: true });
    videoElRef.current = element;
    audioRef.current?.resume();
    audioRef.current?.attachVideo(element);
    setVideo(element);
    setPickingSeat(false);
    setMode('auditorium');
    element.play().then(() => {
      if (aliveRef.current) setVideoPlaying(true);
    }).catch(() => {
      if (aliveRef.current) setVideoPlaying(false);
    });
    if (previous) {
      const source = previous.src;
      previous.pause();
      if (source.startsWith('blob:')) URL.revokeObjectURL(source);
    }
  }, [flash, stopPlayback]);

  const toggleVideo = useCallback(() => {
    const element = videoElRef.current;
    if (!element) return;
    if (element.paused) {
      element.play().then(() => {
        if (aliveRef.current) setVideoPlaying(true);
      }).catch(() => {});
    } else {
      element.pause();
      setVideoPlaying(false);
    }
  }, []);

  const enterExperience = useCallback((id) => {
    const next = experienceById(id);
    if (!next) return;
    stopPlayback();
    setExperience(next);
    setPickingSeat(true);
    setMode('auditorium');
  }, [stopPlayback]);

  const startMovie = useCallback(() => {
    const next = experience;
    if (!next) return;
    clearVideo();
    setPickingSeat(false);
    runtimeRef.current = new CinemaRuntime(next, {
      onSubtitle: (text) => {
        if (aliveRef.current) setSubtitle(text);
      },
      speak: (text) => narratorRef.current?.speak(text),
      onCue: (cue) => audioRef.current?.cue(cue.mood),
    });
    setExperience(next);
    setMode('auditorium');
    audioRef.current?.setMode('auditorium');
    audioRef.current?.startExperience(next);
    setEntering(true);
    window.setTimeout(() => {
      if (aliveRef.current) setEntering(false);
    }, 1500);
  }, [clearVideo, experience]);

  const go = useCallback((nextMode) => {
    stopPlayback();
    const element = videoElRef.current;
    if (element && !element.paused) {
      element.pause();
      setVideoPlaying(false);
    }
    setPickingSeat(false);
    setMode(nextMode);
  }, [stopPlayback]);

  const handlePick = useCallback((pick) => {
    if (!pick) return;
    if (pick.action === 'snack') buySnack(pick.id);
    else if (pick.action === 'experience') enterExperience(pick.id);
    else if (pick.action === 'doors') flash('Pick a presentation first — the doors open for whichever you choose.');
  }, [buySnack, enterExperience, flash]);

  return (
    <div className="cinema-root">
      <CinemaStage mode={mode} experience={experience} seat={seat} preview={pickingSeat} video={video} runtimeRef={runtimeRef} onPick={handlePick} onHover={setHover} onView={camera => audioRef.current?.followView(camera)} />
      <CinemaHud ticket={ticket} held={held} notice={notice} onEat={eatSnack} docked={mode === 'auditorium'} />
      <HoverTag hover={hover} />
      <Link to="/" className="cinema-game-return">Back to Bed Wars</Link>

      {pickingSeat && experience ? <SeatPicker selected={seat} experience={experience} onSelect={setSeat} onStart={startMovie} onCancel={() => go('hub')} /> : mode === 'auditorium' ? (
        <>
          <SubtitleTrack text={subtitle} on={subtitlesOn} />
          <MovieToolbar
            experience={experience}
            seat={seat}
            held={held}
            onLobby={() => go('lobby')}
            onChangeMovie={() => go('hub')}
            onEat={eatSnack}
            subtitlesOn={subtitlesOn}
            onSubtitles={() => setSubtitlesOn((value) => !value)}
            narration={narration}
            onNarration={setNarration}
            video={Boolean(video)}
            videoPlaying={videoPlaying}
            onLoadVideo={loadVideo}
            onToggleVideo={toggleVideo}
            fileInputRef={fileInputRef}
          />
        </>
      ) : (
        <div className="cinema-cta">
          {mode === 'lobby' ? (
            <>
              <p>Click any snack on the counter to collect it — all items cost $0.00.</p>
              <button type="button" onClick={() => go('hub')}>Enter the Theatre</button>
            </>
          ) : (
            <>
              <p>Six cinematic Bed Wars stories. Click a poster on the wall to begin.</p>
              <button type="button" onClick={() => go('lobby')}>Back to the Candy Bar</button>
            </>
          )}
        </div>
      )}

      {entering && experience && (
        <div className="cinema-curtain">
          <span>{experience.marquee}</span>
          <small>Original animated experience · not a licensed film</small>
        </div>
      )}
    </div>
  );
}