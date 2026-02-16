import {Composition} from 'remotion';
import {ThreeStagesCircles} from './ThreeStagesCircles';

export const RemotionRoot = () => {
  return (
    <Composition
      id="CircleJourney"
      component={ThreeStagesCircles}
      durationInFrames={270}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
