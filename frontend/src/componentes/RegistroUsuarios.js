import {
  Header,
  Titulo,
  ContenedorHeader,
  Subtitulo,
} from "../elementos/Header";
import Boton from "../elementos/Boton";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BotonAtras from "../elementos/BotonAtras";
import UsuarioEmpleado from "../imagenes/UsuarioEmpleado.png";
import UsuarioAlumno from "../imagenes/UsuarioAlumno.png";
import { ContenedorImagen, ImagenLogo1, ContenedorBotonRegistro } from "../elementos/ContenedoresBotones";

const RegistroUsuarios = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Registrar Usuarios</title>
      </Helmet>

      <Header>
        <ContenedorHeader>
          <Titulo>Registro de Usuarios</Titulo>
        </ContenedorHeader>
      </Header>

      <BotonAtras ruta="/usuarios" />

      <ContenedorBotonRegistro>
        <ContenedorImagen>
          <ImagenLogo1 src={UsuarioAlumno} alt="LogoUam" />
          <Boton
            as="button"
            primario
            type="submit"
            onClick={() => navigate("/registro-alumno")}
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
            onClick={() => navigate("/registro-empleado")}
          >
            Administrativo
          </Boton>
        </ContenedorImagen>
      </ContenedorBotonRegistro>
    </>
  );
};

export default RegistroUsuarios;
