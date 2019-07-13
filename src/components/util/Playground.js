import styled from "styled-components";
import { CONTRAST_COLOR } from "../../assets/colors";

const PlaygroundContainer = styled.div`
  color: ${CONTRAST_COLOR};
  box-sizing: border-box;
  min-height: 100vh;
  display: flex;
  padding: 8px;
  > * {
    margin: auto 8px;
    transition: opacity 100ms linear;
  }
  > *:first-child {
    margin-left: auto;
  }
  > *:last-child {
    margin-right: auto;
  }
`;

export const Playground = PlaygroundContainer;
