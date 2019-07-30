import React from "react";
import { Button as XRCButton } from "xrc";

export const Button = props => {
  const variant = props.variant
    ? props.variant
    : props.dummy
    ? "alternative"
    : "primary";

  return <XRCButton {...props} variant={variant} m={3} />;
};
