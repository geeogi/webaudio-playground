import React from "react";
import { Button as XRCButton } from "xrc";

export const Button = props => {
  const variant = props.disabled ? "alternative" : "primary";
  return <XRCButton {...props} variant={variant} mb={3} />;
};
