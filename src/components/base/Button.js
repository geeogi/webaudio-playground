import React from "react";
import styled from "styled-components";
import { Button as XRCButton } from "xrc";
import { DARK_COLOR } from "../../assets/colors";

export const StyledButton = styled(XRCButton)`
  min-width: 150px;
  color: ${props => props.dummy && DARK_COLOR} !important;
  background-color: ${props => props.dummy && DARK_COLOR} !important;
  filter: ${props => props.dummy && "brightness(0.95)"};
`;

export const Button = props => {
  const variant = props.variant
    ? props.variant
    : props.disabled
    ? "alternative"
    : "primary";
  return <StyledButton {...props} variant={variant} m={3} />;
};
