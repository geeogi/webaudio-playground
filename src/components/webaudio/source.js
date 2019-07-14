import React, { useState } from "react";
import { AudioNodeElement } from "../util/AudioNodeElement";

export const SourceComponent = props => {
  const [isActive, setIsActive] = useState(false);

  const handlePlayPause = () => {
    if (!props.audioContext) {
      props.setup();
    } else {
      if (props.audioContext && props.audioContext.state === "suspended") {
        props.audioContext.resume();
      }
      if (props.source.instance.mediaElement.paused) {
        props.source.instance.mediaElement.play();
      } else {
        props.source.instance.mediaElement.pause();
      }
    }
  };

  return (
    <AudioNodeElement
      disabled={props.disabled}
      bypassed={!isActive}
      title={"Source"}
      id={"<audio>"}
    >
      <audio
        src="viper.mp3"
        type="audio/mpeg"
        loop
        onPlay={() => setIsActive(true)}
        onPause={() => setIsActive(false)}
      />
      <button onClick={handlePlayPause}>
        <span>Play/Pause</span>
      </button>
    </AudioNodeElement>
  );
};
