import React from "react";
import styled from "styled-components";

const ErrorMensaje = styled.span`
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 4px;
  display: block;
`;

const MensajeConError = ({ error }) => {
  if (!error) return null; 
  return <ErrorMensaje>{error}</ErrorMensaje>;
};

export default MensajeConError;
