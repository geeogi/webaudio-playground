import React, { useState } from "react";
import { AudioNodeElement } from "../util/AudioNodeElement";

export const PannerNodeComponent = props => {
  let [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  let [orientation, setOrientation] = useState({ x: 0, y: 0, z: 0 });

  const handlePannerPositionChange = e => {
    const newPosition = { ...position };
    newPosition[e.target.name] = e.target.value;
    setPosition(newPosition);
    props.pannerNode.instance.setPosition(position.x, position.y, position.z);
  };

  const handlePannerOrientationChange = e => {
    const newOrientation = { ...orientation };
    newOrientation[e.target.name] = e.target.value;
    setOrientation(newOrientation);
    props.pannerNode.instance.setOrientation(
      orientation.x,
      orientation.y,
      orientation.z
    );
  };
  return (
    <AudioNodeElement
      bypassed={props.pannerNode && props.pannerNode.bypass}
      title={"Panner"}
      id={"pannerNode"}
      setBypass={props.setBypass}
    >
      <label htmlFor="x">x-position</label>
      <input
        name="x"
        type="range"
        min="-1"
        max="1"
        step="0.01"
        onChange={handlePannerPositionChange}
      />
      <label htmlFor="y">y-position</label>
      <input
        name="y"
        type="range"
        min="-1"
        max="1"
        step="0.01"
        onChange={handlePannerPositionChange}
      />
      <label htmlFor="z">z-position</label>
      <input
        name="z"
        type="range"
        min="-1"
        max="1"
        step="0.01"
        onChange={handlePannerPositionChange}
      />

      <label htmlFor="x">x-orientation</label>
      <input
        name="x"
        type="range"
        min="-1"
        max="1"
        step="0.01"
        onChange={handlePannerOrientationChange}
      />
      <label htmlFor="y">y-orientation</label>
      <input
        name="y"
        type="range"
        min="-1"
        max="1"
        step="0.01"
        onChange={handlePannerOrientationChange}
      />
      <label htmlFor="z">z-orientation</label>
      <input
        name="z"
        type="range"
        min="-1"
        max="1"
        step="0.01"
        onChange={handlePannerOrientationChange}
      />
    </AudioNodeElement>
  );
};
