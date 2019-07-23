import React from "react";
import styled from "styled-components";
import { Button as XRCButton } from "xrc";

export const StyledButton = styled(XRCButton)`
  min-width: 150px;
`;

export const Button = props => {
  const variant = props.variant
    ? props.variant
    : props.disabled
    ? "alternative"
    : "primary";
  return <StyledButton {...props} variant={variant} m={3} />;
};
