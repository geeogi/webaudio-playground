import React from "react";
import styled from "styled-components";
import {
  BACKGROUND_COLOR,
  CONTRAST_COLOR,
  LIGHTER_COLOR
} from "../../assets/colors";

export const H1 = styled.h1`
  color: ${CONTRAST_COLOR};
  padding: 8px;
  margin: 0;
  position: absolute;
`;

const CheckboxContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 31px;
  height: 16px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    border-radius: 17px;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${BACKGROUND_COLOR};
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 10px;
    width: 10px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: ${LIGHTER_COLOR};
  }

  input:focus + .slider {
    box-shadow: 0 0 1px ${LIGHTER_COLOR};
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(15px);
    -ms-transform: translateX(15px);
    transform: translateX(15px);
  }
`;

export const Checkbox = props => (
  <CheckboxContainer class="switch">
    <input type="checkbox" {...props} />
    <span class="slider" />
  </CheckboxContainer>
);
