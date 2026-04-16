import React, { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import "../iniciosesion.css";

const IniciarSesion = () => {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) return;

    if (keycloak.authenticated) {
      //obtiene los roles del token parsed
      const roles = keycloak.realmAccess?.roles ?? [];

      if (roles.includes("coordinadores") || roles.includes("técnicos")) {
        //si es coordinador o técnico, va al panel de empleados
        navigate("/inicio-empleado");
      } else {
        //si es alumno o no tiene roles especiales, va al panel de alumnos
        navigate("/inicio-alumno");
      }
    }
  }, [initialized, keycloak, navigate]);

  if (!initialized) return <div>Cargando...</div>;

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Inicio de sesión</h1>
        <p className="login-subtitle">
          Accede con tu cuenta institucional para usar la plataforma.
        </p>

        <div className="login-actions">
          <button onClick={() => keycloak.login()} className="login-button">
            Ingresar
          </button>
        </div>
        
        {/*Información de depuración (eliminar)*/}
        <pre style={{ marginTop: 16, fontSize: 12, opacity: 0.8 }}>
          auth: {String(keycloak.authenticated)}
          {"\n"}
          user: {keycloak.tokenParsed?.preferred_username ?? "—"}
          {"\n"}
          roles: {JSON.stringify(keycloak.realmAccess?.roles ?? [])}
        </pre>
      </div>
    </div>
  );
};

export default IniciarSesion;
