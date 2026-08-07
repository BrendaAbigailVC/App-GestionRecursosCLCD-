import React from "react";
import ReactDOM from "react-dom/client";
import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web";
import { Helmet } from "react-helmet";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import IniciarSesion from "./componentes/InicioSesion";
import EditarAlumno from "./componentes/EditarAlumno";
import EditarEmpleado from "./componentes/EditarEmpleado";
import EditarMaterial from "./componentes/EditarMaterial";
import EditarPass from "./componentes/EditarPass";
import EditarPermiso from "./componentes/EditarPermiso";
import EliminarAlumno from "./componentes/EliminarAlumno";
import EliminarEmpleado from "./componentes/EliminarEmpleado";
import EliminarMaterial from "./componentes/EliminarMaterial";
import EliminarUsuarios from "./componentes/EliminarUsuarios";
import FinalizarPrestamo from "./componentes/FinalizarPrestamo";
import Usuarios from "./componentes/GestionUsuarios";
import Historico from "./componentes/Historico";
import HistoricoAlumno from "./componentes/HistoricoAlumno";
import HomeAlumno from "./componentes/HomeAlumno";
import HomeCoordinador from "./componentes/HomeCoordinador";
import HistorialMaterial from "./componentes/HistorialMaterial";
import IncidenciasMateriales from "./componentes/IncidenciasMateriales";
import MaterialesDisponibles from "./componentes/MaterialesDisponibles";
import MostrarAlumno from "./componentes/MostrarAlumnos";
import MostrarALUMNOPass from "./componentes/MostrarAlumnosPass";
import MostrarEmpleado from "./componentes/MostrarEmpleado";
import MostrarMaterialA from "./componentes/MostrarMaterialA";
import MostrarMateriales from "./componentes/MostrarMateriales";
import MostrarMaterialesA from "./componentes/MostrarMaterialesA";
import MostrarPrestamo from "./componentes/MostrarPrestamo";
import MostrarPrestamoAlumno from "./componentes/MostrarPrestamoAlumno";
import MostrarPrestamosActivos from "./componentes/MostrarPrestamosActivos";
import MostrarUsuarios from "./componentes/MostrarUsuarios";
import Perfil from "./componentes/Perfil";
import PerfilAlumno from "./componentes/PerfilAlumno";
import Permisos from "./componentes/Permisos";
import Prestamos from "./componentes/Prestamos";
import RegistrarAlumno from "./componentes/RegistrarAlumno";
import RegistrarEmpleado from "./componentes/RegistrarEmpleado";
import RegistrarMaterial from "./componentes/RegistrarMaterial";
import RegistrarPrestamo from "./componentes/RegistrarPrestamo";
import RegistrarReporte from "./componentes/RegistrarReporte";
import RegistroUsuarios from "./componentes/RegistroUsuarios";
import Reportes from "./componentes/Reportes";
import keycloak from "./keycloak";
import Contenedor from "./elementos/Contenedor";
import { A, Footer, IMG } from "./elementos/Header";
import Titulos from "./elementos/Titulos";
import Cuajimalpa from "./imagenes/Cuajimalpa.png";
import DCNI from "./imagenes/DCNI.png";
import Juno from "./imagenes/Juno.png";
import "./index.css";
const RutaProtegida = ({ children, rolesPermitidos }) => {
  const { keycloak, initialized } = useKeycloak();
  console.log("ENTRÓ A RUTA PROTEGIDA");
  console.log("Token:", keycloak.tokenParsed);
  console.log("Realm Access:", keycloak.realmAccess);
  console.log("hasRole ALUMNO:", keycloak.hasRealmRole("ALUMNO"));
  
  if (!initialized) return <div>Cargando seguridad...</div>;

  console.log("Autenticado:", keycloak.authenticated);
  console.log("Roles permitidos:", rolesPermitidos);
  console.log("Realm Access:", keycloak.realmAccess);
  console.log("Token:", keycloak.tokenParsed?.realm_access?.roles);

  if (!keycloak.authenticated) {
    return <Navigate to="/login" />;
  }

  const tieneRol = rolesPermitidos.some((rol) => keycloak.hasRealmRole(rol));

  //console.log("¿Tiene rol?:", tieneRol);

  if (!tieneRol) {
    //console.log("ALUMNO:", keycloak.hasRealmRole("ALUMNO"));
    //console.log("COORDINADOR:", keycloak.hasRealmRole("COORDINADOR"));
    //console.log("PROFESOR:", keycloak.hasRealmRole("PROFESOR"));
    //console.log("TECNICO:", keycloak.hasRealmRole("TECNICO"));

    if (keycloak.hasRealmRole("ALUMNO")) {
      return <Navigate to="/inicio-alumno" />;
    }

    return <Navigate to="/acceso-denegado" />;
  }

  return children;
};
const PantallaAccesoDenegado = () => {
  const { keycloak } = useKeycloak();
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Acceso Denegado</h1>
      <p>Tu cuenta no tiene roles asignados en el sistema del CLCD.</p>
      <p>Por favor, contacta al Coordinador para que se te asigne un perfil (Alumno, Profesor, Técnico o Coordinador).</p>
      <button
        onClick={() => keycloak.logout({ redirectUri: window.location.origin })}
        style={{ padding: "10px 20px", backgroundColor: "#b30000", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "20px" }}
      >
        Finalizar Sesión
      </button>
    </div>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ReactKeycloakProvider authClient={keycloak} initOptions={{ onLoad: "check-sso", checkLoginIframe: false, pkceMethod: "S256" }}>
      <>
        <Helmet>
          <meta charSet="UTF-8" />
          <title>Plataforma UAM Cuajimalpa</title>
        </Helmet>
        <Titulos />
        <BrowserRouter>
          <Contenedor>
            <Routes>
              <Route path="/login" element={<IniciarSesion />} />
              <Route path="/" element={<IniciarSesion />} />
              <Route path="/usuarios" element={<RutaProtegida rolesPermitidos={["COORDINADOR"]}><Usuarios /></RutaProtegida>} />
              <Route path="/registro-usuarios" element={<RutaProtegida rolesPermitidos={["COORDINADOR"]}><RegistroUsuarios /></RutaProtegida>} />
              <Route path="/eliminar-usuarios" element={<RutaProtegida rolesPermitidos={["COORDINADOR"]}><EliminarUsuarios /></RutaProtegida>} />
              <Route path="/permisos" element={<RutaProtegida rolesPermitidos={["COORDINADOR"]}><Permisos /></RutaProtegida>} />
              <Route path="/editar-permiso/:id" element={<RutaProtegida rolesPermitidos={["COORDINADOR"]}><EditarPermiso /></RutaProtegida>} />
              <Route path="/mostrar-alumnos-pass" element={<RutaProtegida rolesPermitidos={["COORDINADOR"]}><MostrarALUMNOPass /></RutaProtegida>} />
              <Route path="/editar-pass/:id" element={<RutaProtegida rolesPermitidos={["COORDINADOR"]}><EditarPass /></RutaProtegida>} />
              <Route path="/registro-empleado" element={<RutaProtegida rolesPermitidos={["COORDINADOR"]}><RegistrarEmpleado /></RutaProtegida>} />
              <Route path="/mostrar-empleados" element={<RutaProtegida rolesPermitidos={["COORDINADOR"]}><MostrarEmpleado /></RutaProtegida>} />
              <Route path="/eliminar-empleado" element={<RutaProtegida rolesPermitidos={["COORDINADOR"]}><EliminarEmpleado /></RutaProtegida>} />
              <Route path="/editar-empleado/:id" element={<RutaProtegida rolesPermitidos={["COORDINADOR"]}><EditarEmpleado /></RutaProtegida>} />
              
              <Route path="/inicio-empleado" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><HomeCoordinador /></RutaProtegida>} />
              <Route path="/materiales" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><MaterialesDisponibles /></RutaProtegida>} />
              <Route path="/registro-material" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><RegistrarMaterial /></RutaProtegida>} />
              <Route path="/mostrar-materiales" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><MostrarMateriales /></RutaProtegida>} />
              <Route path="/editar-material/:id" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><EditarMaterial /></RutaProtegida>} />
              <Route path="/eliminar-material" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><EliminarMaterial /></RutaProtegida>} />
              <Route path="/registro-alumno" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><RegistrarAlumno /></RutaProtegida>} />
              <Route path="/mostrar-alumnos" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><MostrarAlumno /></RutaProtegida>} />
              <Route path="/editar-alumno/:id" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><EditarAlumno /></RutaProtegida>} />
              <Route path="/eliminar-alumno" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><EliminarAlumno /></RutaProtegida>} />
              <Route path="/reportes" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><Reportes /></RutaProtegida>} />
              <Route path="/registro-reporte" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><RegistrarReporte /></RutaProtegida>} />
              <Route path="/historico" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><Historico /></RutaProtegida>} />
              <Route path="/prestamos" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><Prestamos /></RutaProtegida>} />
              <Route path="/mostrar-prestamos-activos" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><MostrarPrestamosActivos /></RutaProtegida>} />
              <Route path="/registro-prestamo" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><RegistrarPrestamo /></RutaProtegida>} />
              <Route path="/finalizar-prestamo/:id" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><FinalizarPrestamo /></RutaProtegida>} />
              <Route path="/mostrar-usuarios" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><MostrarUsuarios /></RutaProtegida>} />
              
              <Route path="/inicio-alumno" element={<RutaProtegida rolesPermitidos={["ALUMNO", "PROFESOR", "COORDINADOR", "TECNICO"]}><HomeAlumno /></RutaProtegida>} />
              <Route path="/mostrar-materiales-a" element={<RutaProtegida rolesPermitidos={["ALUMNO", "PROFESOR"]}><MostrarMaterialesA /></RutaProtegida>} />
              <Route path="/mostrar-material-a/:id" element={<RutaProtegida rolesPermitidos={["ALUMNO", "PROFESOR"]}><MostrarMaterialA /></RutaProtegida>} />
              <Route path="/historial-material/:id" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><HistorialMaterial /></RutaProtegida>} />
              <Route path="/incidencias-materiales" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO"]}><IncidenciasMateriales /></RutaProtegida>} />

              <Route path="/perfil-alumno" element={<RutaProtegida rolesPermitidos={["ALUMNO"]}><PerfilAlumno /></RutaProtegida>} />
              <Route path="/historico-alumno" element={<RutaProtegida rolesPermitidos={["ALUMNO"]}><HistoricoAlumno /></RutaProtegida>} />
              <Route path="/mostrar-prestamo-alumno/:id" element={<RutaProtegida rolesPermitidos={["ALUMNO"]}><MostrarPrestamoAlumno /></RutaProtegida>} />
              <Route path="/mostrar-prestamo/:id" element={<MostrarPrestamo  rolesPermitidos={["COORDINADOR", "TECNICO"]}/>} />
              <Route path="/perfil" element={<RutaProtegida rolesPermitidos={["COORDINADOR", "TECNICO", "PROFESOR"]}><Perfil /></RutaProtegida>} />
              <Route path="/app" element={<App />} />
              <Route path="/acceso-denegado" element={<PantallaAccesoDenegado />} />
            </Routes>
          </Contenedor>
        </BrowserRouter>
        <Footer>
          <A href="https://www.cua.uam.mx/" target="_blank" rel="noopener noreferrer"><IMG src={Cuajimalpa} alt="UAMC" /></A>
          <A href="https://juno.uam.mx:8443/sae/cua/aewbf001.omuestraframes?mod=1" target="_blank" rel="noopener noreferrer"><IMG src={Juno} alt="ModuloEscolar" /></A>
          <A href="https://dcni.cua.uam.mx" target="_blank" rel="noopener noreferrer"><IMG src={DCNI} alt="DCNI" /></A>
        </Footer>
      </>
    </ReactKeycloakProvider>
  </React.StrictMode>
);