import styled from "styled-components";
import React from "react";
import { DARK_COLOR, LIGHT_COLOR, BACKGROUND_COLOR } from "../assets/colors";

const AudioNodeElementContainer = styled.div`
  width: 160px;
  background-color: ${DARK_COLOR};
  border: solid 4px ${LIGHT_COLOR};
  border-radius: 4px;
  font-size: 14px;
  padding: 4px;
  word-wrap: break-word;
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
    color: ${BACKGROUND_COLOR};
    margin: 16px 0px;
  }
`;

export const AudioNodeElement = props => {
  return (
    <AudioNodeElementContainer>
      <h3>{props.title}</h3>
      <h6>{props.id}</h6>
      {props.setBypass && (
        <>
          <label htmlFor="enabled">Enabled</label>
          <input
            name="enabled"
            type="checkbox"
            checked={!props.bypassed}
            onChange={e => props.setBypass(props.id, !e.target.checked)}
          />
        </>
      )}
      {props.children}
    </AudioNodeElementContainer>
  );
};
