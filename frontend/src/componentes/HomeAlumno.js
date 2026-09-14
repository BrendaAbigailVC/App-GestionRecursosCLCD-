import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";
import { Header, Titulo, ContenedorHeader } from "../elementos/Header";
import Boton from "../elementos/Boton";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Materiales from "../imagenes/orden.png";
import Historico from "../imagenes/Historico.png";
import Perfil from "../imagenes/HuellaPantera.png";
import { ContenedorImagen, ImagenLogo1, ContenedorBotonRegistro, } from "../elementos/ContenedoresBotones";

const HomeAlumno = () => {
  const { keycloak, initialized } = useKeycloak();

  const navigate = useNavigate();

  //useEffect(() => {
  //const id = localStorage.getItem("idUsuario");
  //const tipo = localStorage.getItem("tipoUsuario");
  //
  //if (!id || tipo !== "alumno") {
  //navigate("/");
  //}
  //}, [navigate]);

  useEffect(() => {
  if (!initialized) return;

  if (!keycloak.authenticated) {
    navigate("/", { replace: true });
    return;
  }

  if (!keycloak.hasRealmRole("ALUMNO")) {
    navigate("/acceso-denegado", { replace: true });
  }
}, [initialized, keycloak.authenticated, navigate]);

  return (
    <>
    <Helmet> <title>Inicio de Alumno</title> </Helmet>
    <Header> <ContenedorHeader> <Titulo>Inicio de Alumno</Titulo> </ContenedorHeader> </Header>
     <div style={{ textAlign: "right", padding: "10px" }}>
      <Boton as="button" primario onClick={() => keycloak.logout({ redirectUri: window.location.origin + "/login", }) } > Cerrar sesión </Boton>
     </div>

    <ContenedorBotonRegistro>
      <ContenedorImagen>
        <ImagenLogo1 src={Materiales} alt="Materiales" />
          <Boton as="button" primario onClick={() => navigate("/mostrar-materiales-a")} > Materiales Disponibles </Boton>
      </ContenedorImagen>
      <ContenedorImagen>
        <ImagenLogo1 src={Historico} alt="Historico" />
          <Boton as="button" primario onClick={() => navigate("/historico-alumno")} > Historico </Boton>
      </ContenedorImagen>
      <ContenedorImagen>
        <ImagenLogo1 src={Perfil} alt="Perfil" />
        <Boton as="button" primario onClick={() => navigate("/perfil-alumno")}> Perfil </Boton>
      </ContenedorImagen>
    </ContenedorBotonRegistro>
    </>
  );
};

export default HomeAlumno;
