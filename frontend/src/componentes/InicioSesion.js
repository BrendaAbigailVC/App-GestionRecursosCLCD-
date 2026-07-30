import React, { useEffect, useRef } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate, useLocation } from "react-router-dom";
import "../iniciosesion.css";

import { API_BASE_URL } from "./config";

const IniciarSesion = () => {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();
  const location = useLocation();

  // Evita ejecutar la sincronización más de una vez
  const yaSincronizo = useRef(false);

  const sincronizarUsuario = async () => {
    if (!keycloak.token) return;

    try {
      console.log("Iniciando petición al backend...");

      const response = await fetch(`${API_BASE_URL}/auth/login-check`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          alert(
            "Tu cuenta existe en Keycloak, pero no está registrada en la base de datos."
          );
        } else {
          alert("Error al verificar la identidad.");
        }
        return;
      }

      const data = await response.json();

      console.log("Sincronización con backend exitosa:", data);

      const perfil = data.datos || data.user || {};

      localStorage.setItem("userData", JSON.stringify(perfil));
      localStorage.setItem(
        "roles",
        JSON.stringify(keycloak.realmAccess?.roles ?? [])
      );

      if (data.tipo === "alumno") {
        localStorage.setItem("idUsuario", perfil.id);
        localStorage.setItem("tipoUsuario", "alumno");
      }

      if (data.tipo === "empleado") {
        localStorage.setItem("idUsuario", perfil.id);
        localStorage.setItem("tipoUsuario", "empleado");
      }

      const roles = keycloak.realmAccess?.roles ?? [];

      console.log("Roles Keycloak:", roles);

      // Navegar solo si estamos en login
      if (
        location.pathname === "/" ||
        location.pathname === "/login"
      ) {
        if (
          roles.includes("COORDINADOR") ||
          roles.includes("TECNICO") ||
          roles.includes("PROFESOR")
        ) {
          navigate("/inicio-empleado", { replace: true });
        } else if (roles.includes("ALUMNO")) {
          navigate("/inicio-alumno", { replace: true });
        }
      }
    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el backend.");
    }
  };

  useEffect(() => {
    console.log("Estado de keycloak:", {
      initialized,
      authenticated: keycloak.authenticated,
    });

    if (!initialized) return;
    if (!keycloak.authenticated) return;

    // Solo sincronizar una vez
    if (yaSincronizo.current) return;

    // Solo desde login
    if (
      location.pathname !== "/" &&
      location.pathname !== "/login"
    ) {
      return;
    }

    yaSincronizo.current = true;
    sincronizarUsuario();

  }, [
    initialized,
    keycloak.authenticated,
    location.pathname,
  ]);

  if (!initialized) {
    return (
      <div className="login-loading">
        <p>Cargando plataforma...</p>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Plataforma CLCD</h1>

        <p className="login-subtitle">
          Sistema de Gestión de Recursos - UAM Cuajimalpa
        </p>

        <div className="login-actions">
          {!keycloak.authenticated ? (
            <>
              <p className="login-info">
                Inicia sesión para gestionar tus materiales y préstamos.
              </p>

              <button
                onClick={() => keycloak.login()}
                className="login-button"
              >
                Ingresar con Cuenta UAM
              </button>
            </>
          ) : (
            <div className="login-redirecting">
              <p>Autenticado correctamente.</p>

              <button
                className="login-button"
                style={{
                  marginTop: "10px",
                  backgroundColor: "#28a745",
                }}
                onClick={sincronizarUsuario}
              >
                Forzar Sincronización Manual
              </button>

              <p style={{ marginTop: "15px" }}>
                Sincronizando con el servidor...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IniciarSesion;