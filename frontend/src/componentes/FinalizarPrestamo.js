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

const TablaMateriales = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th,
  td {
    padding: 0.6rem 0.8rem;
    text-align: left;
    border-bottom: 1px solid #ccc;
  }

  th {
    background-color: #f5f5f5;
  }

  tr:hover {
    background-color: #f9f9f9;
  }
`;

const FinalizarPrestamo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [prestamo, setPrestamo] = useState(null);
  const [materiales, setMateriales] = useState([]);
  const [observacionesDevolucion, setObservacionesDevolucion] = useState("");
  const [incidencias, setIncidencias] = useState({});

  useEffect(() => {
    const idUsuario = localStorage.getItem("idUsuario");
    const tipoUsuario = localStorage.getItem("tipoUsuario");

    if (!idUsuario || tipoUsuario !== "empleado") {
      navigate("/");
      return;
    }

    const fetchPrestamo = async () => {
      try {
        const res = await fetch(`http://148.206.162.62:4000/prestamo/${id}`);
        if (!res.ok) throw new Error("No se pudo cargar el préstamo.");
        const data = await res.json();
        setPrestamo(data);
        setMateriales(data.materiales || []);
      } catch (err) {
        console.error(err);
        alert("Error al obtener el préstamo.");
      }
    };

    fetchPrestamo();
  }, [id, navigate]);

  const traducirTipo = (tipo) => {
    return tipo === 0 ? "Interno" : tipo === 1 ? "Externo" : "Desconocido";
  };

  const finalizarPrestamo = async () => {
    //if (!window.confirm("¿Deseas finalizar este préstamo?")) return;
    if (!validarIncidencias()) return;

    const observaciones = generarObservaciones();
    try {
      const res = await fetch(`http://148.206.162.62:4000/finalizar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ observaciones }),
      });

      if (!res.ok) throw new Error("No se pudo finalizar el préstamo.");

      alert("Préstamo finalizado correctamente.");
      navigate("/mostrar-prestamos-activos");
    } catch (err) {
      console.error(err);
      alert("Hubo un error al finalizar el préstamo.");
    }
  };

  const validarIncidencias = () => {
    for (const mat of materiales) {
      const inc = incidencias[mat.idmaterial];
      if (!inc) {
        alert(`Debes indicar el estado del material: ${mat.nombrematerial}`);
        return false;
      }
      if (inc.estado === "mal" && !inc.comentario.trim()) {
        alert(`Describe el problema del material: ${mat.nombrematerial}`);
        return false;
      }
    }
    return true;
  };

  const generarObservaciones = () => {
    return materiales
      .map((mat) => {
        const inc = incidencias[mat.idmaterial];
        if (inc.estado === "bien") {
          return `${mat.nombrematerial}: sin incidencias`;
        }
        return `${mat.nombrematerial}: ${inc.comentario}`;
      })
      .join(" | ");
  };

  return (
    <>
      <Helmet>
        <title>Finalizar Préstamo</title>
      </Helmet>

      <Header>
        <ContenedorHeader>
          <Titulo>Finalizar Préstamo</Titulo>
        </ContenedorHeader>
      </Header>

      <BotonAtras ruta="/mostrar-prestamos-activos" />

      {prestamo ? (
        <FormularioRegistro>
          <FormularioRegistroSecciones>
            <TitutuloSecciones>Datos del Préstamo</TitutuloSecciones>
            <Input2 value={`ID: ${prestamo.id}`} disabled />
            <Input2 value={`Matrícula: ${prestamo.matriculaAlumno}`} disabled />
            <Input2 value={`Empleado: ${prestamo.numeroEconomico}`} disabled />
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
              value={`Tipo: ${traducirTipo(prestamo.tipoPrestamo)}`}
              disabled
            />
            <Input2 value={`UEA: ${prestamo.uea}`} disabled />
            <Input2 value={`Grupo: ${prestamo.grupo}`} disabled />
          </FormularioRegistroSecciones>

          <FormularioRegistroSecciones>
            <TitutuloSecciones>Materiales Prestados</TitutuloSecciones>
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
                    </td>
                  </tr>
                ))}
              </tbody>

            </TablaMateriales>

          </FormularioRegistroSecciones>



          <ContenedorBoton>
            <Boton as="button" onClick={finalizarPrestamo}>
              Procesar Devolución
            </Boton>
          </ContenedorBoton>
        </FormularioRegistro>
      ) : (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          Cargando préstamo...
        </p>
      )}
    </>
  );
};

export default FinalizarPrestamo;
