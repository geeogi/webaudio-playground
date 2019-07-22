import React from "react";
import styled from "styled-components";
import {
  ACTIVE_COLOR,
  DARK_COLOR,
  LIGHT_COLOR,
  SECONDARY_CONTRAST_COLOR
} from "../../assets/colors";
import { Switch } from "./Switch";

const AudioNodeElementContainer = styled.div`
  background-color: ${DARK_COLOR};
  border-radius: 4px;
  font-size: 14px;
  padding: 8px;
  opacity: ${props => (props.disabled ? 0.3 : 1)};
  border: solid 4px
    ${props => (props.bypassed || props.disabled ? LIGHT_COLOR : ACTIVE_COLOR)};
  > * {
    display: block;
  }
  > h3 {
    margin: 0px 0px 8px 0px;
  }
  > h6 {
    margin: 0px 0px 8px;
  }
  > label {
    font-weight: bold;
    font-style: italic;
    color: ${SECONDARY_CONTRAST_COLOR};
    margin: 12px 0px;
  }
`;

export const AudioNodeElement = props => {
  const isEnabled = !props.disabled && !props.bypassed;
  const toggleBypassed = () => props.setBypass(props.id, !props.bypassed);
  return (
    <AudioNodeElementContainer
      disabled={props.disabled}
      bypassed={props.bypassed}
    >
      <h3>{props.title}</h3>
      <h6>{props.id}</h6>
      {props.setBypass && (
        <>
          <Switch
            disabled={props.disabled}
            enabled={isEnabled}
            onSwitch={toggleBypassed}
          />
        </>
      )}
      {props.children}
    </AudioNodeElementContainer>
  );
};
