import { Header, Titulo, ContenedorHeader } from "../elementos/Header";
import Boton from "../elementos/Boton";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BotonAtras from "../elementos/BotonAtras";
import AnadirPrestamo from "../imagenes/anadirPrestamo.png";
import ActualizarPrestamo from "../imagenes/actualizarPrestamo.png";
import { ContenedorImagen, ImagenLogo1, ContenedorBotonRegistro } from "../elementos/ContenedoresBotones";

import React, { useEffect } from "react";
import { useKeycloak } from '@react-keycloak/web';
const Prestamos = () => {
  const navigate = useNavigate();
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      navigate("/"); //
    }
  }, [initialized, keycloak, navigate]);

  if (!initialized) return <div>Cargando...</div>;

  return (
    <>
      <Helmet>
        <title>Gestión de Prestamos</title>
      </Helmet>

      <Header>
        <ContenedorHeader>
          <Titulo>Gestión de Prestamos</Titulo>
        </ContenedorHeader>
      </Header>
      <BotonAtras ruta="/inicio-empleado" />
      <ContenedorBotonRegistro>
        <ContenedorImagen>
          <ImagenLogo1 src={AnadirPrestamo} alt="LogoUam" />
          <Boton
            as="button"
            primario
            type="submit"
            onClick={() => navigate("/registro-prestamo")}
          >
            {" "}
            Añadir Prestamo
          </Boton>
        </ContenedorImagen>
        <ContenedorImagen>
          <ImagenLogo1 src={ActualizarPrestamo} alt="LogoUam" />
          <Boton
            as="button"
            primario
            type="submit"
            onClick={() => navigate("/mostrar-prestamos-activos")}
          >
            {" "}
            Recibir Prestamo
          </Boton>
        </ContenedorImagen>
      </ContenedorBotonRegistro>
    </>
  );
};

export default Prestamos;
