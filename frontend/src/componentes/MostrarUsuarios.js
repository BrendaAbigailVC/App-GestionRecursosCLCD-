import { useKeycloak } from "@react-keycloak/web";

import {Header,Titulo,ContenedorHeader} from "../elementos/Header";
import Boton from "../elementos/Boton";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BotonAtras from "../elementos/BotonAtras";
import UsuarioEmpleado from "../imagenes/UsuarioEmpleado.png";
import UsuarioAlumno from "../imagenes/UsuarioAlumno.png";
import { ContenedorImagen, ImagenLogo1, ContenedorBotonRegistro } from "../elementos/ContenedoresBotones";

const MostrarUsuarios = () => {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();

  //validacion de seguridad: solo coordinadores pueden acceder a esta vista
  useEffect(() => {
    if (initialized){
      //si el alumno no es coordinador ni tecnico, lo redirige al inicio
      const esPersonal = keycloak.hasRealmRole("coordinadores") || keycloak.hasRealmRole("técnicos");

      if (!keycloak.authenticated || !esPersonal) {
        navigate("/inicio-alumno");
      }
    }
  }, [initialized, keycloak, navigate]);

  if (!initialized) return <div>Verificando permisos...</div>

  return (
    <>
      <Helmet>
        <title>Mostrar Usuarios</title>
      </Helmet>

      <Header>
        <ContenedorHeader>
          <Titulo>Visualización de Usuarios</Titulo>
        </ContenedorHeader>
      </Header>

      <BotonAtras ruta="/usuarios" />

      <p style = {{textAlign: 'center', color: 'green'}}>
        Identidad verificada: {keycloak.tokenParsed?.preferred_username}
      </p>

      <ContenedorBotonRegistro>
        <ContenedorImagen>
          <ImagenLogo1 src={UsuarioAlumno} alt="LogoUam" />
          <Boton
            as="button"
            primario
            type="submit"
            onClick={() => navigate("/mostrar-alumnos")}
          >
            {" "}
            Alumno
          </Boton>
        </ContenedorImagen>
        <ContenedorImagen>
          <ImagenLogo1 src={UsuarioEmpleado} alt="LogoUam" />
          <Boton
            as="button"
            primario
            type="submit"
            onClick={() => navigate("/mostrar-empleados")}
          >
            Administrativo
          </Boton>
        </ContenedorImagen>
      </ContenedorBotonRegistro>
    </>
  );
};

export default MostrarUsuarios;
