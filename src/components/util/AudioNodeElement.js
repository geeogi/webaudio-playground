import React from "react";
import styled from "styled-components";
import {
  DARK_COLOR,
  LIGHT_COLOR,
  SECONDARY_CONTRAST_COLOR
} from "../../assets/colors";
import { Checkbox } from "./base";

const AudioNodeElementContainer = styled.div`
  min-width: 180px;
  box-sizing: border-box;
  background-color: ${DARK_COLOR};
  border: solid 4px ${LIGHT_COLOR};
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
    <AudioNodeElementContainer>
      <h3>{props.title}</h3>
      <h6>{props.id}</h6>
      {props.setBypass && (
        <Checkbox
          name="enabled"
          type="checkbox"
          checked={!props.bypassed}
          onChange={e => props.setBypass(props.id, !e.target.checked)}
        />
      )}
      {props.children}
    </AudioNodeElementContainer>
  );
};
