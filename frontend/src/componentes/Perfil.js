import { useKeycloak } from '@react-keycloak/web';

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Header, Titulo, ContenedorHeader } from "../elementos/Header";
import Boton from "../elementos/Boton";
import {
  TitutuloSecciones,
  FormularioRegistroSecciones,
  Input2,
  ContenedorBoton,
  FormularioRegistro,
} from "../elementos/ElementosDeFormulario";
import imagen1 from "../imagenes/motasPantera4.png";

const ImagenMotas = styled.img`
  position: absolute;
  top: 12%;
  left: 76%;
  width: 24%;
  height: 80%;
  z-index: -1;
  @media (max-width: 768px) {
    margin-left: 0;
    width: 24%;
    height: 80%;
    left: 76%;
  }
`;

// Tabla de permisos
const TablaPermisos = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th,
  td {
    padding: 0.6rem 0.8rem;
    text-align: left;
    border-bottom: 1px solid #ccc;
  }

  th {
    background-color: #f5f5f5;
  }

  tr:hover {
    background-color: #f9f9f9;
  }
`;

const Perfil = () => {
  const navigate = useNavigate();
  const { keycloak, initialized } = useKeycloak(); //Hook de Keycloak
  const [empleado, setEmpleado] = useState(null);
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);
  const [permisosAsignados, setPermisosAsignados] = useState([]);

  useEffect(() => {
    //1.Verificación de Seguridad con Keycloak
    if (initialized && !keycloak.authenticated) {
      navigate("/"); //Si no está logueado, fuera de aquí
      return;
    }

    //2.Obtener datos del usuario desde el Token de Keycloak
    //Usamos el 'sub' (ID único de Keycloak) o el 'preferred_username'
    const idKeycloak = keycloak.tokenParsed?.sub; 
    
    //Si ya tenemos el ID de Keycloak, podemos buscar sus datos extra en nuestro backend
    if (idKeycloak) {
      fetch(`http://148.206.162.62:4000/empleado/${idKeycloak}`)
        .then((response) => response.json())
        .then((data) => setEmpleado(data))
        .catch((error) => console.error("Error al obtener empleado:", error));
    }

    //Mantener la carga de permisos
    fetch("http://148.206.162.62:4000/permisos-empleado")
      .then((response) => response.json())
      .then((data) => setPermisosDisponibles(data))
      .catch((error) => console.error("Error:", error));

    //Los permisos ahora los podemos sacar de los roles del Token
    if (keycloak.realmAccess) {
      //Supongamos que tus permisos coinciden con los roles de Keycloak
      setPermisosAsignados(keycloak.realmAccess.roles || []);
    }
  }, [initialized, keycloak, navigate]);

  //Si Keycloak aún no termina de cargar, mostramos un estado de espera
  if (!initialized) return <p>Cargando seguridad...</p>;

  return (
    <>
      <Helmet>
        <title>Perfil - {keycloak.tokenParsed?.preferred_username}</title>
      </Helmet>
      <FormularioRegistro>
        <FormularioRegistroSecciones>
          <TitutuloSecciones>Datos de la Cuenta (Keycloak)</TitutuloSecciones>
          Usuario:
          <Input2 value={keycloak.tokenParsed?.preferred_username || ""} disabled />
          Correo:
          <Input2 value={keycloak.tokenParsed?.email || ""} disabled />
        </FormularioRegistroSecciones>

        <FormularioRegistroSecciones>
          <TitutuloSecciones>Datos del Empleado (Base de Datos)</TitutuloSecciones>
          {empleado ? (
            <>
              Nombre completo:
              <Input2 value={`${empleado.nombre} ${empleado.apellidopaterno}`} disabled />
              No. Económico:
              <Input2 value={empleado.noeconomico} disabled />
            </>
          ) : (
            <p>Sincronizando con base de datos...</p>
          )}
        </FormularioRegistroSecciones>        
        <ContenedorBoton>
          <Boton primario onClick={() => keycloak.logout()}>Cerrar Sesión</Boton>
          <Boton as="button" onClick={() => navigate("/inicio-empleado")}>Regresar</Boton>
        </ContenedorBoton>

        
      </FormularioRegistro>
    </>
  );
};

export default Perfil;
