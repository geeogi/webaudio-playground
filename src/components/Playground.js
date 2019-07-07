import styled from "styled-components";
import { BACKGROUND_COLOR, CONTRAST_COLOR } from "../assets/colors";

const PlaygroundContainer = styled.div`
  background-color: ${BACKGROUND_COLOR};
  color: ${CONTRAST_COLOR};
  box-sizing: border-box;
  border: solid 4px #444;
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  > * {
    margin: 8px;
  }
`;

export const Playground = PlaygroundContainer;
