import React from "react";
import { AudioNodeElement } from "../base/AudioNodeElement";

export const GainComponent = props => {
  const handleGainChange = e => {
    props.gainNode.instance.gain.value = e.target.value;
  };
  return (
    <AudioNodeElement
      disabled={props.disabled}
      bypassed={props.gainNode && props.gainNode.bypass}
      title={"Gain"}
      id={"gain"}
      setBypass={props.setBypass}
    >
      <label htmlFor="gain">Gain:</label>
      <input
        disabled={props.disabled}
        name="gain"
        type="range"
        min="0"
        max="1.5"
        defaultValue="1"
        step="0.01"
        onChange={handleGainChange}
      />
    </AudioNodeElement>
  );
};
