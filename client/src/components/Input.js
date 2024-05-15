import React from "react";
import styled from "styled-components";

export const Input = styled.input.attrs(props => ({
  type: props.type
}))`
  width:100%;
  height:40px;
  background: transparent;
  border-radius: 5px;
  border: 1px solid #dfe3e6;
  box-sizing:border-box;
  text-align:center;
  padding:2px 10px;
  margin: 0.2rem;
  background-color: ${props => props.type == "submit" ? "#0069D9" : "white"};
  color: ${props => props.type == "submit" ? "white" : ""};
`;

export const PopUpInput = styled(Input)`
    font-size: 1rem;
    font-weight: 400;
`;