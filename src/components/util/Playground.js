import styled from "styled-components";
import { CONTRAST_COLOR } from "../../assets/colors";

const PlaygroundContainer = styled.div`
  color: ${CONTRAST_COLOR};
  display: flex;
  padding: 8px;
  align-items: flex-start;
  > * {
    margin: 0 8px;
  }
`;

export const Playground = PlaygroundContainer;
