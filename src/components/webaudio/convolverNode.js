import React, { useEffect } from "react";
import { AudioNodeElement } from "../util/AudioNodeElement";

export const ConvolverComponent = props => {
  // Set convolution
  useEffect(() => {
    if (props.convolverNode && props.decodedAudioData) {
      props.convolverNode.instance.buffer = props.decodedAudioData;
    }
  }, [props.convolverNode, props.decodedAudioData]);

  return (
    <AudioNodeElement
      disabled={props.disabled}
      bypassed={props.convolverNode && props.convolverNode.bypass}
      title={"Reverb"}
      id={"convolver"}
      setBypass={props.setBypass}
    />
  );
};
