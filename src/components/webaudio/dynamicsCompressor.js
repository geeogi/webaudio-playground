import React from "react";
import { AudioNodeElement } from "../util/AudioNodeElement";

export const DynamicsCompressorComponent = props => {
  const handleDynamicsCompressorChange = e => {
    props.dynamicsCompressorNode.instance[e.target.name].value = e.target.value;
  };

  return (
    <AudioNodeElement
      disabled={props.disabled}
      bypassed={
        props.dynamicsCompressorNode && props.dynamicsCompressorNode.bypass
      }
      title={"Compressor"}
      id={"dynamicsCompressor"}
      setBypass={props.setBypass}
    >
      <label htmlFor="attack">Attack:</label>
      <input
        disabled={props.disabled}
        name="attack"
        type="range"
        min="0"
        max="1"
        defaultValue="0.003"
        step="0.01"
        onChange={handleDynamicsCompressorChange}
      />
      <label htmlFor="knee">Knee:</label>
      <input
        disabled={props.disabled}
        name="knee"
        type="range"
        min="0"
        max="40"
        defaultValue="30"
        step="0.01"
        onChange={handleDynamicsCompressorChange}
      />
      <label htmlFor="ratio">Ratio:</label>
      <input
        disabled={props.disabled}
        name="ratio"
        type="range"
        min="1"
        max="20"
        defaultValue="12"
        step="0.01"
        onChange={handleDynamicsCompressorChange}
      />
      <label htmlFor="release">Release:</label>
      <input
        disabled={props.disabled}
        name="release"
        type="range"
        min="0"
        max="1"
        defaultValue="0.25"
        step="0.01"
        onChange={handleDynamicsCompressorChange}
      />
      <label htmlFor="threshold">Threshold:</label>
      <input
        disabled={props.disabled}
        name="threshold"
        type="range"
        min="-100"
        max="0"
        defaultValue="-24"
        step="0.01"
        onChange={handleDynamicsCompressorChange}
      />
    </AudioNodeElement>
  );
};
