import { Header, Titulo, ContenedorHeader } from "../elementos/Header";
import Boton from "../elementos/Boton";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BotonAtras from "../elementos/BotonAtras";
import AnadirMaterial from "../imagenes/AnadirMaterial.png";
import EliminarMaterial from "../imagenes/EliminarMaterial.png";
import BuscarMaterial from "../imagenes/BuscarMaterial.png";
import { ContenedorImagen, ImagenLogo1, ContenedorBotonRegistro } from "../elementos/ContenedoresBotones";

const MaterialesDisponibles = () => {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Gestión de Materiales</title>
      </Helmet>

      <Header>
        <ContenedorHeader>
          <Titulo>Gestión de Materiales</Titulo>
        </ContenedorHeader>
      </Header>
      <BotonAtras ruta="/inicio-empleado" />

      <ContenedorBotonRegistro>
        <ContenedorImagen>
          <ImagenLogo1 src={AnadirMaterial} alt="LogoUam" />
          <Boton
            as="button"
            primario
            type="submit"
            onClick={() => navigate("/registro-material")}
          >
            {" "}
            Añadir Material
          </Boton>
        </ContenedorImagen>
        <ContenedorImagen>
          <ImagenLogo1 src={EliminarMaterial} alt="LogoUam" />
          <Boton
            as="button"
            primario
            type="submit"
            onClick={() => navigate("/eliminar-material")}
          >
            {" "}
            Eliminar Material
          </Boton>
        </ContenedorImagen>
        <ContenedorImagen>
          <ImagenLogo1 src={BuscarMaterial} alt="LogoUam" />
          <Boton
            as="button"
            primario
            type="submit"
            onClick={() => navigate("/mostrar-materiales")}
          >
            {" "}
            Mostrar Materiales
          </Boton>
        </ContenedorImagen>
      </ContenedorBotonRegistro>
    </>
  );
};

export default MaterialesDisponibles;
