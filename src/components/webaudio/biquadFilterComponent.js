import React from "react";
import { AudioNodeElement } from "../base/AudioNodeElement";

export const BiquadFilterComponent = props => {
  const handleFilterFrequencyChange = e => {
    props.biquadFilterNode.instance.frequency.value = e.target.value;
  };
  const handleFilterQChange = e => {
    props.biquadFilterNode.instance.Q.value = e.target.value;
  };
  const handleFilterTypeChange = e => {
    props.biquadFilterNode.instance.type = e.target.value;
  };
  return (
    <AudioNodeElement
      disabled={props.disabled}
      bypassed={props.biquadFilterNode && props.biquadFilterNode.bypass}
      title={"Filter"}
      id={"biquadFilter"}
      setBypass={props.setBypass}
    >
      <label htmlFor="type">Type:</label>
      <select
        disabled={props.disabled}
        name="type"
        onChange={handleFilterTypeChange}
      >
        <option>lowpass</option>
        <option>highpass</option>
        <option>lowshelf</option>
        <option>highshelf</option>
        <option>bandpass</option>
        <option>allpass</option>
      </select>
      <label htmlFor="frequency">Frequency:</label>
      <input
        disabled={props.disabled}
        name="frequency"
        type="range"
        min="0"
        max="40000"
        defaultValue="350"
        step="0.01"
        onChange={handleFilterFrequencyChange}
      />
      <label htmlFor="q">Q:</label>
      <input
        disabled={props.disabled}
        name="q"
        type="range"
        min="0"
        max="20"
        defaultValue="1"
        step="0.01"
        onChange={handleFilterQChange}
      />
    </AudioNodeElement>
  );
};
