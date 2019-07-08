import React from "react";
import { AudioNodeElement } from "../util/AudioNodeElement";

export const SourceComponent = props => {
  const handlePlayPause = () => {
    const audioElement = document.querySelector("audio");
    if (props.audioContext.state === "suspended") {
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
      <audio src="viper.mp3" type="audio/mpeg" onCanPlayThrough={props.setup} />
      <button onClick={handlePlayPause} disabled={!props.audioContext}>
        <span>Play/Pause</span>
      </button>
    </AudioNodeElement>
  );
};
