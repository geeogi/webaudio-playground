import styled from "styled-components";
import { DARK_COLOR, LIGHT_COLOR } from "../assets/colors";

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
`;

export const AudioNodeElement = AudioNodeElementContainer;
