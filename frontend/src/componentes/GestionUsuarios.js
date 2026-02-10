import { Header, Titulo, ContenedorHeader } from "../elementos/Header";
import Boton from "../elementos/Boton";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BotonAtras from "../elementos/BotonAtras";
import AnadirUsuario from "../imagenes/AgregarUsuario.png";
import EliminarUsuario from "../imagenes/EliminarUsuario.png";
import BuscarUsuario from "../imagenes/BuscarUsuario.png";
import { ContenedorImagen, ImagenLogo1, ContenedorBotonRegistro } from "../elementos/ContenedoresBotones";

const GestionUsuarios = () => {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Gestión de Usuarios</title>
      </Helmet>

      <Header>
        <ContenedorHeader>
          <Titulo>Gestión de Usuarios</Titulo>
        </ContenedorHeader>
      </Header>
      <BotonAtras ruta="/inicio-empleado" />

      <ContenedorBotonRegistro>
        <ContenedorImagen>
          <ImagenLogo1 src={AnadirUsuario} alt="LogoUam" />
          <Boton
            as="button"
            primario
            type="submit"
            onClick={() => navigate("/registro-usuarios")}
          >
            {" "}
            Añadir Usuario
          </Boton>
        </ContenedorImagen>
        <ContenedorImagen>
          <ImagenLogo1 src={EliminarUsuario} alt="LogoUam" />
          <Boton
            as="button"
            primario
            type="submit"
            onClick={() => navigate("/eliminar-usuarios")}
          >
            {" "}
            Eliminar Usuario
          </Boton>
        </ContenedorImagen>
        <ContenedorImagen>
          <ImagenLogo1 src={BuscarUsuario} alt="LogoUam" />
          <Boton
            as="button"
            primario
            type="submit"
            onClick={() => navigate("/mostrar-usuarios")}
          >
            {" "}
            Mostrar Usuarios
          </Boton>
        </ContenedorImagen>
      </ContenedorBotonRegistro>
    </>
  );
};

export default GestionUsuarios;
