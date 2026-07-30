import React, { useEffect, useCallback } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import "../iniciosesion.css";

import { API_BASE_URL } from "./config";

const IniciarSesion = () => {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();

  // Sacamos la función afuera del useEffect para que el botón pueda usarla
  // Usamos useCallback para que la función no se recree innecesariamente
  const sincronizarUsuario = useCallback(async () => {
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

      if (response.ok) {
        const data = await response.json();
        console.log("Sincronización con backend exitosa:", data);

        const perfil = data.datos || data.user || {};
        localStorage.setItem("userData", JSON.stringify(perfil));

        if (data.tipo === "alumno" && perfil.id) {
          localStorage.setItem("idUsuario", perfil.id);
          localStorage.setItem("tipoUsuario", "alumno");
        } else if (data.tipo === "empleado" && perfil.id) {
          localStorage.setItem("idUsuario", perfil.id);
          localStorage.setItem("tipoUsuario", "empleado");
        }

        const roles = keycloak.realmAccess?.roles ?? [];
        if (roles.includes("coordinadores") || roles.includes("técnicos")) {
          navigate("/inicio-empleado");
        } else {
          navigate("/inicio-alumno");
        }
      } else {
        if (response.status === 404) {
          alert("Error: Tu cuenta de Keycloak es válida, pero no está registrada en la base de datos local. Contacta al administrador.");
        } else {
          alert("Hubo un problema al verificar tu identidad en el servidor.");
        }
      }
    } catch (error) {
      console.error("Error de red al conectar con el backend:", error);
      alert("No se pudo conectar con el servidor. Revisa si el backend está encendido.");
    }
  }, [keycloak.token, keycloak.realmAccess, navigate]);

  useEffect(() => {
    console.log("Estado de keycloak:", {
      initialized,
      authenticated: keycloak.authenticated,
    });

    if (initialized && keycloak.authenticated) {
      sincronizarUsuario();
    }
  }, [initialized, keycloak.authenticated, sincronizarUsuario]);

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
              <button onClick={() => keycloak.login()} className="login-button">
                Ingresar con Cuenta UAM
              </button>
            </>
          ) : (
            <div className="login-redirecting">
              <p>Autenticado correctamente.</p>

              <button
                onClick={() => sincronizarUsuario()}
                className="login-button"
                style={{ marginTop: "10px", backgroundColor: "#28a745" }}
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