import styled from "styled-components";
export const ContenedorImagen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: 240px;
  text-align: center;
`;

export const ImagenLogo1 = styled.img`
  width: 100%;
  max-width: 150px;
  height: auto;
`;

export const ContenedorBotonRegistro = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 32px;
  margin: 2%;
  justify-items: center;
`;