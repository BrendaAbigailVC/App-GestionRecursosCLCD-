import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Header, Titulo, ContenedorHeader } from "../elementos/Header";
import {
  TitutuloSecciones,
  FormularioRegistroSecciones,
  Input2,
  ContenedorBoton,
  FormularioRegistro,
} from "../elementos/ElementosDeFormulario";
import Boton from "../elementos/Boton";
import BotonAtras from "../elementos/BotonAtras";
import { useKeycloak } from '@react-keycloak/web';
import { API_BASE_URL } from "./config";
import Swal from "sweetalert2";

const TablaMateriales = styled.table`
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

const FinalizarPrestamo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { keycloak, initialized } = useKeycloak();
  const [prestamo, setPrestamo] = useState(null);
  const [materiales, setMateriales] = useState([]);

  useEffect(() => {
    if (initialized) {
      if (!keycloak.authenticated) {
        navigate("/");
        return;
      }

      const fetchPrestamo = async () => {
        try {
          // Solución: Codificamos el ID para escapar los caracteres especiales y guiones del folio
          const idCodificado = encodeURIComponent(id);

          const res = await fetch(`${API_BASE_URL}/prestamos/finalizar/${idCodificado}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${keycloak.token}`
            },
            body: JSON.stringify({ observaciones: "Devolución sin incidencias" })
          });

          if (!res.ok) throw new Error("No se pudo cargar el préstamo.");

          await Swal.fire("Éxito", "Préstamo finalizado y stock actualizado.", "success");
          navigate("/mostrar-prestamos-activos");

        } catch (err) {
          console.error(err);
          Swal.fire("Error", "No se pudo obtener la información del préstamo.", "error");
        }
      };

      fetchPrestamo();
    }
  }, [id, navigate, initialized, keycloak]);

  const finalizarPrestamo = async () => {
    const result = await Swal.fire({
      title: '¿Confirmar devolución?',
      text: "Se registrará la entrada de los materiales al inventario.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, recibir',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      // Solución: Codificamos el ID también aquí para que la ruta PUT no retorne 404
      const idCodificado = encodeURIComponent(id);
      const res = await fetch(`${API_BASE_URL}/prestamos/finalizar/${idCodificado}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${keycloak.token}`
        },
        body: JSON.stringify({ observaciones: "Devolución sin incidencias" })
      });

      if (!res.ok) throw new Error("Error al procesar la devolución.");

      await Swal.fire("Éxito", "Préstamo finalizado y stock actualizado.", "success");
      navigate("/mostrar-prestamos-activos");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Hubo un problema al finalizar el préstamo.", "error");
    }
  };

  if (!initialized) return <p style={{ textAlign: "center" }}>Cargando sesión...</p>;

  return (
    <>
      <Helmet><title>Finalizar Préstamo</title></Helmet>
      <Header>
        <ContenedorHeader><Titulo>Finalizar Préstamo</Titulo></ContenedorHeader>
      </Header>
      <BotonAtras ruta="/mostrar-prestamos-activos" />

      {prestamo ? (
        <FormularioRegistro>
          <FormularioRegistroSecciones>
            <TitutuloSecciones>Resumen de Préstamo</TitutuloSecciones>
            <Input2 value={`Folio: ${prestamo.id || id}`} disabled />
            <Input2 value={`Solicitante: ${prestamo.solicitante_nombre || 'N/A'}`} disabled />
            <Input2 value={`ID Solicitante: ${prestamo.solicitante_codigo || 'N/A'}`} disabled />
            <Input2 value={`Tipo: ${prestamo.solicitante_tipo || 'N/A'}`} disabled />
            <Input2 value={`Atendió: ${prestamo.numeroEconomico || 'N/A'}`} disabled />
            <Input2 value={`UEA: ${prestamo.uea || 'N/A'}`} disabled />
            <Input2 value={`Grupo: ${prestamo.grupo || 'N/A'}`} disabled />
          </FormularioRegistroSecciones>

          <FormularioRegistroSecciones>
            <TitutuloSecciones>Artículos a Devolver</TitutuloSecciones>
            <TablaMateriales>
              <thead>
                <tr>
                  <th>ID Material</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {materiales.length > 0 ? (
                  materiales.map((mat, index) => (
                    <tr key={index}>
                      <td>{mat.idmaterial}</td>
                      <td>{mat.nombrematerial}</td>
                      <td>{mat.cantidad}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>No se encontraron artículos individuales adjuntos a este folio.</td>
                  </tr>
                )}
              </tbody>
            </TablaMateriales>
          </FormularioRegistroSecciones>

          <ContenedorBoton>
            <Boton as="button" type="button" onClick={finalizarPrestamo}>
              Procesar Devolución
            </Boton>
          </ContenedorBoton>
        </FormularioRegistro>
      ) : (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando datos del folio...</p>
      )}
    </>
  );
};

export default FinalizarPrestamo;