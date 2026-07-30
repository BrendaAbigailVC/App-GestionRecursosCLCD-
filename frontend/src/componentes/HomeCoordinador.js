import { useKeycloak } from "@react-keycloak/web";
import { Header, Titulo, ContenedorHeader } from "../elementos/Header";
import Boton from "../elementos/Boton";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { API_BASE_URL } from "./config";


import PerfilImg from "../imagenes/HuellaPantera.png";
import HistoricoImg from "../imagenes/Historico.png";
import OrdenImg from "../imagenes/orden.png";
import UsuarioImg from "../imagenes/usuario.png";
import ActualizaCredencialesImg from "../imagenes/ActualizaciónCredencial2.png";
import PermisoImg from "../imagenes/permiso.png";
import PrestamoImg from "../imagenes/Prestamo.png";

import {
  ContenedorImagen,
  ImagenLogo1,
  ContenedorBotonRegistro,
} from "../elementos/ContenedoresBotones";

const HomeCoordinador = () => {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();
 
  const [permisosDB, setPermisosDB] = useState([]);

useEffect(() => {
  if (!initialized) return;

  if (!keycloak.authenticated) {
    navigate("/login", { replace: true });
    return;
  }

  const cargarPermisosRealTime = async () => {
    try {
      const idKeycloak = keycloak.tokenParsed?.sub;

      const resEmp = await fetch(
        `${API_BASE_URL}/empleados/perfil/${idKeycloak}`
      );

      if (!resEmp.ok) {
        console.error("Empleado no encontrado");
        return;
      }

      const empleado = await resEmp.json();

      if (!empleado?.noeconomico) {
        console.error("Empleado sin número económico");
        return;
      }

      const resPerm = await fetch(
        `${API_BASE_URL}/empleados/${empleado.noeconomico}/permisos`
      );

      if (!resPerm.ok) {
        console.error("No se pudieron obtener los permisos");
        return;
      }

      const dataPerm = await resPerm.json();

      setPermisosDB(
        dataPerm.map((p) => Number(p.idpermiso))
      );

    } catch (error) {
      console.error("Error al cargar permisos dinámicos:", error);
    }
  };

  cargarPermisosRealTime();

}, [initialized, keycloak.authenticated, navigate]);

  if (!initialized) {
    return <div style={{ padding: "20px", textAlign: "center" }}><h2>Verificando...</h2></div>;
  }

  const tienePermiso = (id) => {
    return permisosDB.includes(id);
  };

  return (
    <>
      <Helmet><title>Inicio de Empleado</title></Helmet>
      <Header>
        <ContenedorHeader><Titulo>Inicio de Empleado</Titulo></ContenedorHeader>
      </Header>

      <div style={{ textAlign: "right", padding: "10px" }}>
        <Boton as="button" primario onClick={() => keycloak.logout()}>Cerrar sesión</Boton>
      </div>

      <ContenedorBotonRegistro>
        {/*PRÉSTAMOS - ID 4 en BD*/}
        {tienePermiso(4) && (
          <ContenedorImagen>
            <ImagenLogo1 src={PrestamoImg} alt="Prestamos" />
            <Boton as="button" primario onClick={() => navigate("/prestamos")}>Prestamos</Boton>
          </ContenedorImagen>
        )}

        {/*MATERIALES - ID 0 en BD*/}
        {tienePermiso(0) && (
          <ContenedorImagen>
            <ImagenLogo1 src={OrdenImg} alt="Materiales" />
            <Boton as="button" primario onClick={() => navigate("/materiales")}>Materiales Disponibles</Boton>
          </ContenedorImagen>
        )}

        {/*HISTORICO - Siempre visible*/}
        <ContenedorImagen>
          <ImagenLogo1 src={HistoricoImg} alt="Historico" />
          <Boton as="button" primario onClick={() => navigate("/historico")}>Historico</Boton>
        </ContenedorImagen>

        {/*USUARIOS Y CONTRASEÑAS - ID 1 en BD*/}
        {tienePermiso(1) && (
          <>
            <ContenedorImagen>
              <ImagenLogo1 src={UsuarioImg} alt="Usuarios" />
              <Boton as="button" primario onClick={() => navigate("/usuarios")}>Usuarios</Boton>
            </ContenedorImagen>
            
            {/* Deshabilitado temporalmente
            <ContenedorImagen>
              <ImagenLogo1 src={ActualizaCredencialesImg} alt="Pass" />
              <Boton as="button" primario onClick={() => navigate("/mostrar-alumnos-pass")}>Actualizar Contraseña</Boton>
            </ContenedorImagen>
            */}

          </>
        )}

        {/*PERMISOS - ID 3 en BD*/}
        {tienePermiso(3) && (
          <ContenedorImagen>
            <ImagenLogo1 src={PermisoImg} alt="Permisos" />
            <Boton as="button" primario onClick={() => navigate("/permisos")}>Permisos</Boton>
          </ContenedorImagen>
        )}

        {/*PERFIL - Siempre visible*/}
        <ContenedorImagen>
          <ImagenLogo1 src={PerfilImg} alt="Perfil" />
          <Boton as="button" primario onClick={() => navigate("/perfil")}>Perfil</Boton>
        </ContenedorImagen>
      </ContenedorBotonRegistro>
    </>
  );
};

export default HomeCoordinador;