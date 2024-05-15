import styled from "styled-components";

const Wrapper = styled.div`
  width:100vw; 
  padding:20px 50px; 
  margin:5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  box-sizing:border-box;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
  
  @media (min-width: 600px) {
    max-width: 400px;
  }
`;

export default Wrapper;