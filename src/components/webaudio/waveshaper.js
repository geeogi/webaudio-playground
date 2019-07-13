import React from "react";
import { AudioNodeElement } from "../util/AudioNodeElement";

export const WaveShaperComponent = props => (
  <AudioNodeElement
    disabled={props.disabled}
    bypassed={props.waveShaperNode && props.waveShaperNode.bypass}
    title={"Distortion"}
    id={"waveShaperNode"}
    setBypass={props.setBypass}
  />
);
