import { Header, Titulo, ContenedorHeader } from "../elementos/Header";
import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BotonAtras from "../elementos/BotonAtras";
import { useKeycloak } from '@react-keycloak/web';
import { API_BASE_URL } from "./config";
const Tabla = styled.table`
  width: 90%; margin: 20px auto; border-collapse: collapse;
  background: #ffffff; border-radius: 10px; overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;
const EncabezadoTabla = styled.thead` background-color: #5d9cec; color: white; text-align: center; `;
const CeldaEncabezado = styled.th` padding: 12px 15px; `;
const Celda = styled.td` padding: 10px 15px; border-bottom: 1px solid #ddd; text-align: center; `;
const ContenedorBusqueda = styled.div` width: 90%; margin: 20px auto; display: flex; justify-content: flex-end; `;
const InputBusqueda = styled.input` padding: 10px; width: 300px; border-radius: 5px; border: 1px solid #ccc; `;
const Boton = styled.button`
  padding: 8px 12px; background-color: #5cb85c; border: none; color: white;
  border-radius: 7px; cursor: pointer; &:hover { background-color: #4cae4c; }
`;
const MostrarPrestamosActivos = () => {
  const navigate = useNavigate();
  const { keycloak, initialized } = useKeycloak();
  const [prestamos, setPrestamos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState(null);
  const URL_API = API_BASE_URL;
  const obtenerPrestamos = useCallback(async () => {
    if (!keycloak?.token) return;
    try {
      console.log("Intentando conectar a:", `${URL_API}/prestamos/activos`);
      const response = await fetch(`${URL_API}/prestamos/activos`, {
        headers: {
          'Authorization': `Bearer ${keycloak.token}`
        }
      });
      if (!response.ok) throw new Error(`Error servidor: ${response.status}`);
      const data = await response.json();
      setPrestamos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error en petición:", err);
      setError(err.message);
    }
  }, [keycloak?.token]);
  useEffect(() => {
    if (initialized) {
      if (!keycloak.authenticated) {
        navigate("/");
      } else {
        obtenerPrestamos();
      }
    }
  }, [initialized, keycloak?.authenticated, navigate, obtenerPrestamos]);
  if (!initialized) return <div style={{color: 'orange', padding: '20px'}}>Cargando Keycloak...</div>;
  if (error) return <div style={{color: 'red', padding: '20px'}}>Error de conexión: {error}</div>;
  const prestamosFiltrados = prestamos.filter((p) => {
    const termino = busqueda.toLowerCase();
    const id = p.id ? String(p.id).toLowerCase() : "";
    const codigo = p.solicitante_codigo ? String(p.solicitante_codigo).toLowerCase() : "";
    const nombre = p.solicitante_nombre ? String(p.solicitante_nombre).toLowerCase() : "";
    return id.includes(termino) || codigo.includes(termino) || nombre.includes(termino);
  });
  return (
    <>
      <Helmet><title>Préstamos Activos</title></Helmet>
      <Header>
        <ContenedorHeader><Titulo>Listado de Préstamos Activos</Titulo></ContenedorHeader>
      </Header>
      <BotonAtras ruta="/prestamos" />
      <ContenedorBusqueda>
        <InputBusqueda
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </ContenedorBusqueda>
      <Tabla>
        <EncabezadoTabla>
          <tr>
            <CeldaEncabezado>ID</CeldaEncabezado>
            <CeldaEncabezado>Solicitante</CeldaEncabezado>
            <CeldaEncabezado>Opción</CeldaEncabezado>
          </tr>
        </EncabezadoTabla>
        <tbody>
          {prestamosFiltrados.length > 0 ? (
            prestamosFiltrados.map((p) => (
              <tr key={p.id}>
                <Celda>{p.id}</Celda>
                <Celda>
                  <strong>{p.solicitante_nombre}</strong><br/>
                  <small>{p.solicitante_codigo}</small>
                </Celda>
                <Celda>
                  <Boton onClick={() => navigate(`/finalizar-prestamo/${p.id}`)}>
                    Recibir
                  </Boton>
                </Celda>
              </tr>
            ))
          ) : (
            <tr>
              <Celda colSpan="3">No se encontraron préstamos activos en este momento.</Celda>
            </tr>
          )}
        </tbody>
      </Tabla>
    </>
  );
};
export default MostrarPrestamosActivos;