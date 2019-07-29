import React from "react";
import { Button } from "./Button";

export const Switch = props => {
  const variant = props.IsSwitchedOn ? "primary" : "alternative";
  return (
    <Button
      variant={variant}
      onClick={props.onSwitch}
      disabled={props.disabled}
      mb={3}
    >
      {props.IsSwitchedOn ? "Enabled" : "Disabled"}
    </Button>
  );
};
