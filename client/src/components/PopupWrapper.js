import styled from "styled-components";

export const PopupWrapper = styled.div`
  width: 500px;
  padding: 10px; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing:border-box;
    
  @media (min-width: 768px) {
    max-width: 400px;
  }
`;