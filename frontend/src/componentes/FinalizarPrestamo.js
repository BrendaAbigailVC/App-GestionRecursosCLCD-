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
  const [incidencias, setIncidencias] = useState({});

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

          const res = await fetch(`${API_BASE_URL}/prestamos/prestamo/${idCodificado}`);

          if (!res.ok) throw new Error("No se pudo cargar el préstamo.");
          const data = await res.json();
          setPrestamo(data);
          setMateriales(data.materiales || []);
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "No se pudo obtener la información del préstamo.", "error");
        }
      };

      fetchPrestamo();
    }
  }, [id, navigate, initialized, keycloak]);

  const traducirTipoPrestamo = (tipo) => {
    return tipo === 0 ? "Interno" : tipo === 1 ? "Externo" : "Desconocido";
  };

  const traducirTipoMaterial = (tipo) => {
    return tipo === 0 ? "Inventariado" : "Consumible";
  };

  const finalizarPrestamo = async () => {
    console.log("Incidencias recibidas:", incidencias);

    if (!validarIncidencias()) return;

    const observaciones = generarObservaciones();

    try {
      // Solución: Codificamos el ID también aquí para que la ruta PUT no retorne 404
      const idCodificado = encodeURIComponent(id);
      const res = await fetch(`${API_BASE_URL}/prestamos/finalizar/${idCodificado}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${keycloak.token}`
        },
        body: JSON.stringify({ observaciones, incidencias }),
      });

      if (!res.ok) throw new Error("No se pudo finalizar el préstamo.");
     
      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Préstamo finalizado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/mostrar-prestamos-activos");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Hubo un problema al finalizar el préstamo.", "error");
    }
  };


  const validarIncidencias = () => {
    for (const mat of materiales) {
      const inc = incidencias[mat.idmaterial];
      if (!inc) {
        Swal.fire({
          icon: "warning",
          title: "Campo obligatorio",
          text: `Debes indicar el estado del material: ${mat.nombrematerial}`,
        });
        return false;
      }
      if (inc.estado === "mal" && !inc.comentario.trim()) {
        Swal.fire({
          icon: "info",
          title: "Descripción requerida",
          text: `Describe el problema del material: ${mat.nombrematerial}`,
        });
        return false;
      }
      if (mat.tipo === 1) {
        if (
          inc.cantidadDevuelta === undefined ||
          inc.cantidadDevuelta === "" ||
          inc.cantidadDevuelta < 0 ||
          inc.cantidadDevuelta > mat.cantidad
        ) {
          Swal.fire(
            "Cantidad inválida",
            `La cantidad devuelta de ${mat.nombrematerial} debe estar entre 0 y ${mat.cantidad}`,
            "warning"
          );
          return false;
        }
      }
    }
    return true;
  };

  const generarObservaciones = () => {
    return materiales
      .map((mat) => {
        const inc = incidencias[mat.idmaterial];
        if (mat.tipo === 0) {
          if (inc.estado === "bien") {
            return `${mat.nombrematerial}: sin incidencias`;
          }
          return `${mat.nombrematerial}: ${inc.comentario}`;
        }

        if (mat.tipo === 1) {
          const devuelta = inc.cantidadDevuelta ?? 0;

          if (devuelta === mat.cantidad) {
            return `${mat.nombrematerial}: devolución completa (${devuelta}/${mat.cantidad})`;
          }

          if (devuelta > 0) {
            return `${mat.nombrematerial}: devolución parcial (${devuelta}/${mat.cantidad})`;
          }

          return `${mat.nombrematerial}: no se devolvió (${devuelta}/${mat.cantidad})`;
        }
      })
      .join(" | ");
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
            <TitutuloSecciones>Datos del Préstamo</TitutuloSecciones>
            <Input2 value={`ID: ${prestamo.id}`} disabled />
            <Input2
              value={`${prestamo.solicitante_tipo === "ALUMNO"
                ? "Matrícula"
                : "No. Económico"
                }: ${prestamo.solicitante_codigo}`}
              disabled
            />
            <Input2
              value={`Nombre: ${prestamo.solicitante_nombre}`}
              disabled
            />
            <Input2
              value={`Fecha préstamo: ${new Date(
                prestamo.fechaPrestamo
              ).toLocaleDateString("es-MX")}`}
              disabled
            />
            <Input2
              value={`Fecha devolución: ${new Date(
                prestamo.fechaDevolucion
              ).toLocaleDateString("es-MX")}`}
              disabled
            />
            <Input2
              value={`Tipo: ${traducirTipoPrestamo(prestamo.tipoPrestamo)}`}
              disabled
            />
            <Input2 value={`UEA: ${prestamo.uea || 'N/A'}`} disabled />
            <Input2 value={`Grupo: ${prestamo.grupo || 'N/A'}`} disabled />
          </FormularioRegistroSecciones>

          <FormularioRegistroSecciones>
            <TitutuloSecciones>Artículos a Devolver</TitutuloSecciones>
            <TablaMateriales>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Material</th>
                  <th>Cantidad</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {materiales.map((mat) => (
                  <tr key={mat.idmaterial}>
                    <td>{mat.idmaterial}</td>
                    <td>{mat.nombrematerial}</td>
                    <td>{mat.cantidad}</td>
                    <td>
                      {mat.tipo === 0 && (
                        <>
                          <label>
                            <input
                              type="radio"
                              name={`estado-${mat.idmaterial}`}
                              checked={incidencias[mat.idmaterial]?.estado === "bien"}
                              onChange={() =>
                                setIncidencias({
                                  ...incidencias,
                                  [mat.idmaterial]: { estado: "bien", comentario: "" },
                                })
                              }
                            />
                            Sin problema
                          </label>
                          <label style={{ marginLeft: "1rem" }}>
                            <input
                              type="radio"
                              name={`estado-${mat.idmaterial}`}
                              checked={incidencias[mat.idmaterial]?.estado === "mal"}
                              onChange={() =>
                                setIncidencias({
                                  ...incidencias,
                                  [mat.idmaterial]: { estado: "mal", comentario: "" },
                                })
                              }
                            />
                            Con incidencia
                          </label>

                          {incidencias[mat.idmaterial]?.estado === "mal" && (
                            <Input2
                              placeholder="Describe el problema"
                              value={incidencias[mat.idmaterial]?.comentario || ""}
                              onChange={(e) =>
                                setIncidencias({
                                  ...incidencias,
                                  [mat.idmaterial]: {
                                    ...incidencias[mat.idmaterial],
                                    comentario: e.target.value,
                                  },
                                })
                              }
                            />
                          )}
                        </>
                      )}
                      {mat.tipo === 1 && (
                        <Input2
                          type="number"
                          min="0"
                          max={mat.cantidad}
                          placeholder="Cantidad devuelta"
                          value={
                            incidencias[mat.idmaterial]?.cantidadDevuelta ?? ""
                          }
                          onChange={(e) =>
                            setIncidencias({
                              ...incidencias,
                              [mat.idmaterial]: {
                                estado: "bien",
                                ...incidencias[mat.idmaterial],
                                cantidadDevuelta: Number(e.target.value),
                              },
                            })
                          }
                        />
                      )}
                    </td>
                  </tr>
                ))}
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
        <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando préstamo...</p>
      )}
    </>
  );
};

export default FinalizarPrestamo;