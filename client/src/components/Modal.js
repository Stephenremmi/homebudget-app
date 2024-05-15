import React, {useState} from "react";
import styled from "styled-components";

const ModalContainer = styled.div`
  z-index: 1050;
  position: fixed;
  border: 1px solid lightgray;
  border-radius: 6px;
  background: white;
  left: 42%;
  top: 20%;
  width: fit-content;
  display: ${props => props.active ? "block" : "none"};
`;

const ModalCover = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
    z-index: 1040;
    display: ${props => props.active ? "block" : "none"};
`;

const CloseModal = styled.button`
 background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 400;
  position: absolute;
  z-index:1150;
  right: 5px;
  top: 4px;
  
  &:hover {
   font-weight: bold;
  }
`;

const Modal = (props) => {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <div>
      <button onClick={() => setModalOpened(!modalOpened)}>+</button>
      <ModalContainer active={modalOpened}>
        <CloseModal onClick={() => setModalOpened(!modalOpened)}>X</CloseModal>
        {props.children}
      </ModalContainer>
      <ModalCover active={modalOpened} onClick={() => setModalOpened(!modalOpened)}/>
    </div>
  )
}

export default Modal;
