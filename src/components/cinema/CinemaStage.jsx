import { useEffect, useRef } from 'react';
import Stage from '@/cinema/three/createCinemaStage';

export default function CinemaStage({ mode, experience, runtimeRef, onPick, onHover }) {
  const hostRef = useRef(null);
  const stageRef = useRef(null);
  const live = useRef({ onPick, onHover, runtimeRef });
  live.current = { onPick, onHover, runtimeRef };

  useEffect(() => {
    if (!hostRef.current) return undefined;
    const stage = new Stage(hostRef.current, {
      getRuntime: () => live.current.runtimeRef?.current || null,
      onPick: (pick) => live.current.onPick?.(pick),
      onHover: (payload) => live.current.onHover?.(payload),
    });
    stageRef.current = stage;
    return () => {
      stage.dispose();
      stageRef.current = null;
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.setMode(mode);
    if (mode === 'auditorium' && experience) stage.setExperience(experience);
  }, [mode, experience]);

  return <div className="cinema-stage" ref={hostRef} />;
}