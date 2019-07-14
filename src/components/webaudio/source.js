import React from "react";
import { AudioNodeElement } from "../util/AudioNodeElement";

export const SourceComponent = props => {
  const handlePlayPause = () => {
    if (!props.audioContext) {
      props.setup();
    } else {
      if (props.audioContext && props.audioContext.state === "suspended") {
        props.audioContext.resume();
      }
      if (!props.isPlaying) {
        props.source.instance.mediaElement.play();
      } else {
        props.source.instance.mediaElement.pause();
      }
    }
  };

  return (
    <AudioNodeElement
      disabled={props.disabled}
      bypassed={!props.isPlaying}
      title={"Source"}
      id={"<audio>"}
    >
      <audio
        src="viper.mp3"
        type="audio/mpeg"
        loop
        onPlay={() => props.setIsPlaying(true)}
        onPause={() => props.setIsPlaying(false)}
      />
      <button onClick={handlePlayPause}>
        <span>Play/Pause</span>
      </button>
    </AudioNodeElement>
  );
};
