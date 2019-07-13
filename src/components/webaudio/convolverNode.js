import React from "react";
import { AudioNodeElement } from "../util/AudioNodeElement";

export const ConvolverNodeComponent = props => (
  <AudioNodeElement disabled={props.disabled} 
    bypassed={props.convolverNode && props.convolverNode.bypass}
    title={"Reverb"}
    id={"convolverNode"}
    setBypass={props.setBypass}
  />
);