import React, { useEffect } from "react";
import { AudioNodeElement } from "../base/AudioNodeElement";

export const WaveShaperComponent = props => {
  // Set curve
  useEffect(() => {
    if (props.waveShaperNode) {
      const curve = new Float32Array(256);
      curve.forEach((_, i) => {
        const x = (i * 2) / 256 - 1;
        curve[i] = ((Math.PI + 15) * x) / (Math.PI + 15 * Math.abs(x));
      });
      props.waveShaperNode.instance.curve = curve;
      props.waveShaperNode.instance.oversample = "4x";
    }
  }, [props.waveShaperNode]);

  return (
    <AudioNodeElement
      disabled={props.disabled}
      bypassed={props.waveShaperNode && props.waveShaperNode.bypass}
      title={"Distortion"}
      id={"waveShaper"}
      setBypass={props.setBypass}
    />
  );
};
