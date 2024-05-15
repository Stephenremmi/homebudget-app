import React from "react";
import styled from "styled-components";

const Label = styled.div`
  min-width:80px;
  height:50%;
  font-size: 1rem;
  box-sizing: border-box;
  background-color:${props => props.type === "info" ? "#5eafff" : ""};
  
  display:flex;
  align-items:center;
  text-align:center;  
  justify-content:center;
    
  border-color: black;
  border-style: solid;
  border-width:${props => props.type === "info" ? " 2px 0 2px 2px" : "2px 2px 2px 0"};
  border-radius:${props => props.type === "info" ? "5px 0 0 5px" : "0 5px 5px 0"};
  margin-left:${props => props.type === "info" ? "5px" : ""};
`;

export default Label;
