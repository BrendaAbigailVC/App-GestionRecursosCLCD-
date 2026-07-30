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
import { API_BASE_URL } from './config';
//import { response } from 'express';

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

  th, td {
    padding: 0.6rem 0.8rem;
    text-align: left;
    border-bottom: 1px solid #ccc;
  }

  th { background-color: #f5f5f5; }

  tr:hover { background-color: #f9f9f9; }
`;

const Perfil = () => {
  const navigate = useNavigate();
  const { keycloak, initialized } = useKeycloak();
  const [empleado, setEmpleado] = useState(null);
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);
  const [permisosAsignados, setPermisosAsignados] = useState([]);

  useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      navigate("/");
      return;
    }

    const idKeycloak = keycloak.tokenParsed?.sub;


    if (idKeycloak) {
      fetch(`${API_BASE_URL}/empleados/perfil/${idKeycloak}`)
        .then((response) => response.json())
        .then((data) => {

          if (!data || !data.noeconomico){
            throw new Error ("No se puede obtener el número económico del empleado");
          }

          setEmpleado(data);
          
          return fetch (`${API_BASE_URL}/empleados/${data.noeconomico}/permisos`);
        })
        .then((res) => res.json())
        .then((permisos) => {
          console.log("Datos recibidos de la API:", permisos);
          //extrae solo los id
          const ids = permisos.map(p => p.idpermiso);
          setPermisosAsignados(ids);
        })
        .catch((error) => console.error("Error al obtener empleado:", error));

      fetch (`${API_BASE_URL}/empleados/permisos-empleado`)
        .then((response) => response.json())
        .then((data) => setPermisosDisponibles (data))
        .catch((error) => console.error("Error al obtener catalogo:", error));
    }
  }, [initialized, keycloak, navigate]);

  if (!initialized) return <p>Cargando seguridad...</p>;



  return (
    <>
      <Helmet>
        <title>Perfil - {keycloak.tokenParsed?.preferred_username}</title>
      </Helmet>

      <Header>
        <ContenedorHeader>
          <Titulo>Perfil</Titulo>
        </ContenedorHeader>
      </Header>

      <ImagenMotas src={imagen1} alt="MotasUam" />

      <FormularioRegistro>
        <FormularioRegistroSecciones>
          <TitutuloSecciones>Datos de la Cuenta</TitutuloSecciones>
          Usuario (Keycloak):
          <Input2 value={keycloak.tokenParsed?.preferred_username || ""} disabled />
          Correo registrado:
          <Input2 value={keycloak.tokenParsed?.email || ""} disabled />
        </FormularioRegistroSecciones>

        <FormularioRegistroSecciones>
          <TitutuloSecciones>Datos del Empleado</TitutuloSecciones>
          {empleado ? (
            <>
              Nombre completo:
              <Input2 value={`${empleado.nombre} ${empleado.apellidopaterno} ${empleado.apellidomaterno}`} disabled />
              No. Económico:
              <Input2 value={empleado.noeconomico} disabled />
              Estado:
              <Input2 value={empleado.estado_nombre} disabled />
              Tipo:
              <Input2 value={empleado.tipo_nombre} disabled />
            </>
          ) : (
            <p>Sincronizando con base de datos...</p>
          )}
        </FormularioRegistroSecciones>

        <FormularioRegistroSecciones>
          <TitutuloSecciones>Permisos asignados</TitutuloSecciones>
          <TablaPermisos>
            <thead>
              <tr>
                <th>Permiso</th>
                <th>Asignado</th>
              </tr>
            </thead>
            <tbody>
              {permisosDisponibles.map((permiso) => (
                <tr key={permiso.id}>
                  <td>{permiso.nombre}</td>
                  <td>
                    {permisosAsignados.includes(permiso.id) ? "Sí" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </TablaPermisos>
        </FormularioRegistroSecciones>

        <ContenedorBoton>
          <Boton primario onClick={() => keycloak.logout()}>Cerrar Sesión</Boton>
          <Boton as="button" onClick={() => navigate("/inicio-empleado")}>Regresar al Menú</Boton>
        </ContenedorBoton>
      </FormularioRegistro>
    </>
  );
};

export default Perfil;