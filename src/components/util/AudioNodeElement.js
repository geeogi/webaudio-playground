import React from "react";
import styled from "styled-components";
import {
  ACTIVE_COLOR,
  DARK_COLOR,
  LIGHT_COLOR,
  SECONDARY_CONTRAST_COLOR
} from "../../assets/colors";

const AudioNodeElementContainer = styled.div`
  opacity: ${props => (props.disabled ? 0.3 : 1)};
  min-width: 180px;
  box-sizing: border-box;
  background-color: ${DARK_COLOR};
  border: solid 4px
    ${props => (props.bypassed || props.disabled ? LIGHT_COLOR : ACTIVE_COLOR)};
  border-radius: 4px;
  font-size: 14px;
  padding: 4px;
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
    margin: 16px 0px;
  }
`;

export const AudioNodeElement = props => {
  return (
    <AudioNodeElementContainer
      disabled={props.disabled}
      bypassed={props.bypassed}
    >
      <h3>{props.title}</h3>
      <h6>{props.id}</h6>
      {props.setBypass && (
        <>
          <label htmlFor="enabled">Enabled:</label>
          <input
            disabled={props.disabled}
            name="enabled"
            type="checkbox"
            checked={!props.disabled && !props.bypassed}
            onChange={e => props.setBypass(props.id, !e.target.checked)}
          />
        </>
      )}
      {props.children}
    </AudioNodeElementContainer>
  );
};
