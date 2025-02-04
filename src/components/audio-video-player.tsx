import React, {useRef} from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export const VideoJS = (props: any) => {
  const videoRef = React.useRef<any>(null);
  const playerRef = React.useRef<any>(null);
  const {options, onReady} = props;

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement('video-js');

      videoElement.classList.add('vjs-big-play-centered');
      videoElement.classList.add('vjs-default-skin');
      videoRef.current?.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready');
        onReady?.(player);
      });

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player: any = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [onReady, options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player: any = playerRef.current;

    return () => {
      if (player && !player?.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player="">
      <div ref={videoRef} />
    </div>
  );
};

type Source = {
  src: string,
  type?: string
};

type PlayerProps = {
  sources: Source[]
}

export function VideoPlayer(props: PlayerProps) {
  const playerRef = useRef(null);

  const options = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: props.sources,
    controlBar: {
      volumePanel: { inline: false } // Ensure volume control is visible
    },
    inactivityTimeout: 0 // Prevent auto-pause when switching tabs
  };

  const onReady = (player: any) => {
    playerRef.current = player;

    // Prevent pausing when tab is inactive
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        player.play();
      }
    });

    // Prevent background audio suspension (Chrome)
    navigator.mediaSession?.setActionHandler('play', () => {
      player.play();
    });
  };

  return (
    <VideoJS options={options} onReady={onReady} />
  );
}
