import React from "react";
import { AudioNodeElement } from "../util/AudioNodeElement";

export const GainNodeComponent = props => {
  const handleGainChange = e => {
    props.gainNode.instance.gain.value = e.target.value;
  };
  return (
    <AudioNodeElement
      bypassed={props.gainNode && props.gainNode.bypass}
      title={"Gain"}
      id={"gainNode"}
      setBypass={props.setBypass}
    >
      <label htmlFor="gain">Gain</label>
      <input
        name="gain"
        type="range"
        min="0"
        max="3"
        defaultValue="1"
        step="0.01"
        onChange={handleGainChange}
      />
    </AudioNodeElement>
  );
};
