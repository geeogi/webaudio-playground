import React from "react";
import { AudioNodeElement } from "../util/AudioNodeElement";

export const SourceComponent = props => {
  return (
    <AudioNodeElement
      bypassed={!props.isPlaying}
      title={"Source"}
      id={"<audio>"}
    >
      <audio
        src="viper.mp3"
        type="audio/mpeg"
        ref={props.reactRef}
        loop
        controls={props.ready}
        onPlay={e => {
          e.preventDefault();
          props.handlePlay();
        }}
        onPause={props.handlePause}
      />
      {!props.ready && <button onClick={props.setup}>Setup</button>}
    </AudioNodeElement>
  );
};
