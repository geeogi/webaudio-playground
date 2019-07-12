import React from "react";
import { AudioNodeElement } from "../util/AudioNodeElement";

export const SourceComponent = props => {
  const handlePlayPause = () => {
    if (!props.audioContext) {
      props.setup();
    }
    const audioElement = document.querySelector("audio");
    if (props.audioContext && props.audioContext.state === "suspended") {
      props.audioContext.resume();
    }
    if (!props.isPlaying) {
      audioElement.play();
      props.setIsPlaying(true);
    } else {
      audioElement.pause();
      props.setIsPlaying(false);
    }
  };
  return (
    <AudioNodeElement title={"Source"} id={"<audio>"}>
      <audio src="viper.mp3" type="audio/mpeg" />
      <button onClick={handlePlayPause}>
        <span>Play/Pause</span>
      </button>
    </AudioNodeElement>
  );
};
