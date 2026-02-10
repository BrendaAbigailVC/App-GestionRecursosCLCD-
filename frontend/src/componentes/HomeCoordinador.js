import { Header, Titulo, ContenedorHeader } from "../elementos/Header";
import Boton from "../elementos/Boton";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import styled from "styled-components";
import Perfil from "../imagenes/HuellaPantera.png";
import Historico from "../imagenes/Historico.png";
import Orden from "../imagenes/orden.png";
import Usuario from "../imagenes/usuario.png";
import ActualizaCredenciales from "../imagenes/ActualizaciónCredencial2.png";
//import Reporte from "../imagenes/reporte.png";
//import Aviso from "../imagenes/aviso.png";
import Permiso from "../imagenes/permiso.png";
import Prestamo from "../imagenes/Prestamo.png";
import BotonAtras from "../elementos/BotonAtras";
import { ContenedorImagen, ImagenLogo1, ContenedorBotonRegistro } from "../elementos/ContenedoresBotones";
/*const ImagenLogo1 = styled.img`
  margin-right: 2%;
  width: 35%;
  @media (max-width: 768px) {
    margin-top: -400px;
    width: 40%;
  }
`;

const ContenedorImagen = styled.div`
  height: 100%;
  width: 100%;
  margin-left: 13%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ContenedorBotonRegistro = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.5%;
  gap: 100px;
`;*/

const HomeCoordinador = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("idUsuario");
    const tipo = localStorage.getItem("tipoUsuario");

    if (!id || tipo !== "empleado") {
      navigate("/");
    }
  }, [navigate]);

  const permisos = JSON.parse(localStorage.getItem("permisosUsuario") || "[]");

  const tienePermiso = (idPermiso) => permisos.includes(idPermiso);

  return (
    <>
      <Helmet>
        <title>Inicio de Empleado</title>
      </Helmet>

      <Header>
        <ContenedorHeader>
          <Titulo>Inicio de Empleado</Titulo>
        </ContenedorHeader>
      </Header>

      <Boton
        as="button"
        primario
        onClick={() => {
          localStorage.clear();
          navigate("/");
        }}
      >
        Cerrar sesión
      </Boton>
      <ContenedorBotonRegistro>
        <ContenedorImagen>
          <ImagenLogo1 src={Orden} alt="LogoUam" />
          {tienePermiso(0) && (
            <Boton as="button" primario onClick={() => navigate("/materiales")}>
              Materiales Disponibles
            </Boton>
          )}
        </ContenedorImagen>
        <ContenedorImagen>
          <ImagenLogo1 src={Historico} alt="LogoUam" />
          <Boton as="button" primario onClick={() => navigate("/historico")}>
            Historico
          </Boton>
        </ContenedorImagen>
        <ContenedorImagen>
          <ImagenLogo1 src={Usuario} alt="LogoUam" />
          {tienePermiso(1) && (
            <Boton as="button" primario onClick={() => navigate("/usuarios")}>
              Usuarios
            </Boton>
          )}
        </ContenedorImagen>
        <ContenedorImagen>
          <ImagenLogo1 src={ActualizaCredenciales} alt="LogoUam" />
          {tienePermiso(1) && (
            <Boton
              as="button"
              primario
              onClick={() => navigate("/mostrar-alumnos-pass")}
            >
              Actualizar Contraseña Usuario
            </Boton>
          )}
        </ContenedorImagen>
        <ContenedorImagen>
          <ImagenLogo1 src={Permiso} alt="LogoUam" />
          {tienePermiso(3) && (
            <Boton as="button" primario onClick={() => navigate("/permisos")}>
              Permisos
            </Boton>
          )}
        </ContenedorImagen>
        <ContenedorImagen>
          <ImagenLogo1 src={Prestamo} alt="LogoUam" />
          {tienePermiso(4) && (
            <Boton as="button" primario onClick={() => navigate("/prestamos")}>
              Prestamos
            </Boton>
          )}
        </ContenedorImagen>
        <ContenedorImagen>
          <ImagenLogo1 src={Perfil} alt="LogoUam" />
          <Boton as="button" primario onClick={() => navigate("/perfil")}>
            Perfil
          </Boton>
        </ContenedorImagen>
      </ContenedorBotonRegistro>
    </>
  );
};

export default HomeCoordinador;
