import React from "react";
import { Button as XRCButton } from "xrc";

export const Switch = props => {
  const variant = props.enabled ? "primary" : "alternative";
  return (
    <XRCButton
      variant={variant}
      onClick={props.onSwitch}
      disabled={props.disabled}
      mb={3}
    >
      {props.enabled ? "Enabled" : "Disabled"}
    </XRCButton>
  );
};
