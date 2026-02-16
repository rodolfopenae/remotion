import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const circleStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute' as const,
  color: '#0f172a',
  fontWeight: 700,
  fontFamily: 'Inter, Arial, sans-serif',
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const ThreeStagesCircles = () => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();

  const stage1End = fps * 3;
  const stage2End = fps * 6;

  const meX = width * 0.3;
  const otherX = width * 0.7;
  const centerY = height * 0.52;

  const meBaseSize = 220;
  const otherSize = 160;

  // Stage 1: TRAINING - dos círculos separados.
  const stage1Progress = clamp(frame / stage1End, 0, 1);

  // Stage 2: MENTORING - "me" se expande y se ovala para cubrir a "other".
  const stage2Progress = clamp((frame - stage1End) / (stage2End - stage1End), 0, 1);
  const stage2Ease = Easing.bezier(0.2, 0.1, 0, 1)(stage2Progress);

  const expansionSpring = spring({
    frame: Math.max(0, frame - stage1End),
    fps,
    config: {
      damping: 18,
      mass: 1,
      stiffness: 90,
    },
    durationInFrames: stage2End - stage1End,
  });

  const meWidth = interpolate(stage2Ease * expansionSpring, [0, 1], [meBaseSize, 560], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const meHeight = interpolate(stage2Ease * expansionSpring, [0, 1], [meBaseSize, 260], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const meCenterX = interpolate(stage2Ease, [0, 1], [meX, width * 0.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Stage 3: COACHING - otro círculo queda dentro de "me".
  const stage3Progress = clamp((frame - stage2End) / (durationInFrames - stage2End), 0, 1);
  const coachingOpacity = interpolate(stage3Progress, [0, 1], [0.85, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const title = frame < stage1End ? 'TRAINING' : frame < stage2End ? 'MENTORING' : 'COACHING';

  return (
    <div
      style={{
        flex: 1,
        background: 'linear-gradient(120deg, #eff6ff, #dbeafe 50%, #e0f2fe)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 72,
          width: '100%',
          textAlign: 'center',
          fontFamily: 'Inter, Arial, sans-serif',
          color: '#1e293b',
          letterSpacing: '0.08em',
          fontWeight: 800,
          fontSize: 54,
        }}
      >
        {title}
      </div>

      {/* Circulo Other */}
      <div
        style={{
          ...circleStyle,
          width: otherSize,
          height: otherSize,
          left: otherX - otherSize / 2,
          top: centerY - otherSize / 2,
          borderRadius: '50%',
          background: '#fde68a',
          border: '5px solid #f59e0b',
          opacity: frame >= stage2End ? coachingOpacity : 1,
          zIndex: 2,
          transform: `scale(${interpolate(stage1Progress, [0, 1], [0.95, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })})`,
        }}
      >
        other
      </div>

      {/* Circulo Me */}
      <div
        style={{
          ...circleStyle,
          width: meWidth,
          height: meHeight,
          left: meCenterX - meWidth / 2,
          top: centerY - meHeight / 2,
          borderRadius: stage2Progress > 0 ? '46% / 50%' : '50%',
          background: '#bfdbfe',
          border: '5px solid #2563eb',
          zIndex: 1,
          boxShadow:
            frame < stage2End
              ? '0 18px 45px rgba(37, 99, 235, 0.22)'
              : '0 24px 64px rgba(37, 99, 235, 0.28)',
          transition: 'box-shadow 200ms linear',
        }}
      >
        me
      </div>
    </div>
  );
};
