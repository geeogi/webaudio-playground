import React from "react";
import { AudioNodeElement } from "../util/AudioNodeElement";

export const WaveShaperComponent = props => (
  <AudioNodeElement
    bypassed={props.waveShaperNode && props.waveShaperNode.bypass}
    title={"WaveShaper"}
    id={"waveShaperNode"}
    setBypass={props.setBypass}
  />
);
