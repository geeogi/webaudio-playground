import React from "react";
import { Button } from "./Button";

export const Switch = props => {
  const variant = props.IsSwitchedOn ? "primary" : "secondary";
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
