import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web';
import keycloak from './keycloak';

import { Navigate } from 'react-router-dom';
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Contenedor from "./elementos/Contenedor";
import { Helmet } from "react-helmet";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import IniciarSesion from "./componentes/InicioSesion";
import RegistroUsuarios from "./componentes/RegistroUsuarios";
import MostrarUsuarios from "./componentes/MostrarUsuarios";
import EliminarUsuarios from "./componentes/EliminarUsuarios";

import RegistrarAlumno from "./componentes/RegistrarAlumno";
import MostrarAlumno from "./componentes/MostrarAlumnos";
import EliminarAlumno from "./componentes/EliminarAlumno";
import EditarAlumno from "./componentes/EditarAlumno";

import RegistrarEmpleado from "./componentes/RegistrarEmpleado";
import MostrarEmpleado from "./componentes/MostrarEmpleado";
import EliminarEmpleado from "./componentes/EliminarEmpleado";
import EditarEmpleado from "./componentes/EditarEmpleado";

import HomeAlumno from "./componentes/HomeAlumno";
import HomeCoordinador from "./componentes/HomeCoordinador";

import MaterialesDisponibles from "./componentes/MaterialesDisponibles";
import RegistrarMaterial from "./componentes/RegistrarMaterial";
import MostrarMateriales from "./componentes/MostrarMateriales";
import EliminarMaterial from "./componentes/EliminarMaterial";
import EditarMaterial from "./componentes/EditarMaterial";
import HistorialMaterial from "./componentes/HistorialMaterial";
import IncidenciasMateriales from "./componentes/IncidenciasMateriales";

import Prestamos from "./componentes/Prestamos";
import RegistrarPrestamo from "./componentes/RegistrarPrestamo";
import MostrarPrestamo from "./componentes/MostrarPrestamo";
import MostrarPrestamosActivos from "./componentes/MostrarPrestamosActivos";
import MostrarPrestamoAlumno from "./componentes/MostrarPrestamoAlumno";
import FinalizarPrestamo from "./componentes/FinalizarPrestamo";

import Historico from "./componentes/Historico";
import HistoricoAlumno from "./componentes/HistoricoAlumno";
import Reportes from "./componentes/Reportes";
import RegistrarReporte from "./componentes/RegistrarReporte";

import Titulos from "./elementos/Titulos";
import Permisos from "./componentes/Permisos";
import EditarPermiso from "./componentes/EditarPermiso";

import MostrarMaterialesA from "./componentes/MostrarMaterialesA";
import MostrarMaterialA from "./componentes/MostrarMaterialA";

import MostrarAlumnosPass from "./componentes/MostrarAlumnosPass";
import EditarPass from "./componentes/EditarPass";

import Perfil from "./componentes/Perfil";
import PerfilAlumno from "./componentes/PerfilAlumno";
import Usuarios from "./componentes/GestionUsuarios";

import { Footer, A, IMG } from "./elementos/Header";
import Juno from "./imagenes/Juno.png";
import Cuajimalpa from "./imagenes/Cuajimalpa.png";
import DCNI from "./imagenes/DCNI.png";

//componente proteccion de rutas
const RutaProtegida = ({ children, rolesPermitidos }) => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) return <div>Cargando seguridad...</div>;

  if (!keycloak.authenticated) {
    return <Navigate to="/login" />;
  }

  const tieneRol = rolesPermitidos.some(rol => keycloak.hasRealmRole(rol));

  if (!tieneRol) {
    //si el alumno intenta entrar a rutas de administracion
    if (keycloak.hasRealmRole('alumnos')) {
      return <Navigate to="/inicio-alumno" />;
    }
    return <Navigate to="/acceso-denegado" />;
  }

  return children;
};

const PantallaAccesoDenegado = () => {
  const { keycloak } = useKeycloak();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Acceso Denegado</h1>
      <p>Tu cuenta no tiene roles asignados en el sistema del CLCD.</p>
      <p>Por favor, contacta al Coordinador para que se te asigne un perfil (Alumno, Profesor, Técnico o Coordinador).</p>
      <button 
        onClick={() => keycloak.logout({ redirectUri: window.location.origin })}
        style={{
          padding: '10px 20px',
          backgroundColor: '#b30000',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Finalizar Sesión
      </button>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ReactKeycloakProvider authClient={keycloak} initOptions={{
        onLoad: 'check-sso',
        //Esto desactiva el iframe de chequeo silencioso que suele fallar en local
        checkLoginIframe: false, 
        //Asegura que use el puerto correcto si hay redirección
        pkceMethod: 'S256'
      }}
    >
      <>
        <Helmet>
          <meta charSet="UTF-8" />
          <title>Plataforma UAM Cuajimalpa</title>
        </Helmet>
        <Titulos />
        <BrowserRouter>
          <Contenedor>
            <Routes>
              {/*RUTAS PÚBLICAS*/}
              <Route path="/login" element={<IniciarSesion />} />          
              <Route path="/" element={<IniciarSesion />} />

              {/*NIVEL COORDINADOR (Gestión de Personal y Seguridad)*/}
              <Route path="/usuarios" element={<RutaProtegida rolesPermitidos={['coordinadores']}><Usuarios /></RutaProtegida>} />
              <Route path="/registro-usuarios" element={<RutaProtegida rolesPermitidos={['coordinadores']}><RegistroUsuarios /></RutaProtegida>} />
              <Route path="/eliminar-usuarios" element={<RutaProtegida rolesPermitidos={['coordinadores']}><EliminarUsuarios /></RutaProtegida>} />
              <Route path="/permisos" element={<RutaProtegida rolesPermitidos={['coordinadores']}><Permisos /></RutaProtegida>} />
              <Route path="/editar-permiso/:id" element={<RutaProtegida rolesPermitidos={['coordinadores']}><EditarPermiso /></RutaProtegida>} />
              <Route path="/mostrar-alumnos-pass" element={<RutaProtegida rolesPermitidos={['coordinadores']}><MostrarAlumnosPass /></RutaProtegida>} />
              <Route path="/editar-pass/:id" element={<RutaProtegida rolesPermitidos={['coordinadores']}><EditarPass /></RutaProtegida>} />
              <Route path="/registro-empleado" element={<RutaProtegida rolesPermitidos={['coordinadores']}><RegistrarEmpleado /></RutaProtegida>} />
              <Route path="/mostrar-empleados" element={<RutaProtegida rolesPermitidos={['coordinadores']}><MostrarEmpleado /></RutaProtegida>} />
              <Route path="/eliminar-empleado" element={<RutaProtegida rolesPermitidos={['coordinadores']}><EliminarEmpleado /></RutaProtegida>} />
              <Route path="/editar-empleado/:id" element={<RutaProtegida rolesPermitidos={['coordinadores']}><EditarEmpleado /></RutaProtegida>} />

              {/*NIVEL TÉCNICO Y COORDINADOR (Operación de Laboratorio)*/}
              <Route path="/inicio-empleado" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos']}><HomeCoordinador /></RutaProtegida>} />
              <Route path="/materiales" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos']}><MaterialesDisponibles /></RutaProtegida>} />
              <Route path="/registro-material" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos']}><RegistrarMaterial /></RutaProtegida>} />
              <Route path="/mostrar-materiales" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos']}><MostrarMateriales /></RutaProtegida>} />
              <Route path="/editar-material/:id" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos']}><EditarMaterial /></RutaProtegida>} />
              <Route path="/eliminar-material" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos']}><EliminarMaterial /></RutaProtegida>} />
              <Route path="/registro-alumno" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos']}><RegistrarAlumno /></RutaProtegida>} />
              <Route path="/mostrar-alumnos" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos']}><MostrarAlumno /></RutaProtegida>} />
              <Route path="/editar-alumno/:id" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos']}><EditarAlumno /></RutaProtegida>} />
              <Route path="/eliminar-alumno" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos']}><EliminarAlumno /></RutaProtegida>} />
              <Route path="/reportes" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos']}><Reportes /></RutaProtegida>} />
              <Route path="/registro-reporte" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos']}><RegistrarReporte /></RutaProtegida>} />
              <Route path="/historico" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos']}><Historico /></RutaProtegida>} />
              <Route path="/prestamos" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos']}><Prestamos /></RutaProtegida>} />
              <Route path="/registro-prestamo" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos']}><RegistrarPrestamo /></RutaProtegida>} />
              <Route path="/finalizar-prestamo/:id" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos']}><FinalizarPrestamo /></RutaProtegida>} />
              <Route path="/mostrar-usuarios" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos']}><MostrarUsuarios /></RutaProtegida>} />

              {/*NIVEL PROFESOR Y ALUMNO (Consulta Académica)*/}
              <Route path="/inicio-alumno" element={<RutaProtegida rolesPermitidos={['alumnos', 'profesores', 'coordinadores', 'técnicos']}><HomeAlumno /></RutaProtegida>} />
              <Route path="/mostrar-materiales-a" element={<RutaProtegida rolesPermitidos={['alumnos', 'profesores']}><MostrarMaterialesA /></RutaProtegida>} />
              <Route path="/mostrar-material-a/:id" element={<RutaProtegida rolesPermitidos={['alumnos', 'profesores']}><MostrarMaterialA /></RutaProtegida>} />
              <Route path="/perfil-alumno" element={<RutaProtegida rolesPermitidos={['alumnos']}><PerfilAlumno /></RutaProtegida>} />
              <Route path="/historico-alumno" element={<RutaProtegida rolesPermitidos={['alumnos']}><HistoricoAlumno /></RutaProtegida>} />
              <Route path="/mostrar-prestamo-alumno/:id" element={<RutaProtegida rolesPermitidos={['alumnos']}><MostrarPrestamoAlumno /></RutaProtegida>} />

              {/*PERFIL GENERAL (Empleados)*/}
              <Route path="/perfil" element={<RutaProtegida rolesPermitidos={['coordinadores', 'técnicos', 'profesores']}><Perfil /></RutaProtegida>} />
              
              <Route path="/app" element={<App />} />
              <Route path="/acceso-denegado" element={<PantallaAccesoDenegado />} />
            </Routes>
          </Contenedor>
        </BrowserRouter>
        <Footer>
          <A
            href="https://www.cua.uam.mx/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IMG src={Cuajimalpa} alt="UAMC" />
          </A>

          <A
            href="https://juno.uam.mx:8443/sae/cua/aewbf001.omuestraframes?mod=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IMG src={Juno} alt="ModuloEscolar" />
          </A>

          <A
            href="https://dcni.cua.uam.mx"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IMG src={DCNI} alt="DCNI" />
          </A>
        </Footer>
      </>
    </ReactKeycloakProvider>
  </React.StrictMode>
);
