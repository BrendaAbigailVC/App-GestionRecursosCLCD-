import React, { useEffect, useState } from "react";
import { Header, ContenedorHeader, Titulo } from "../elementos/Header";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import BotonAtras from "../elementos/BotonAtras";
import Swal from "sweetalert2";
const ContenedorStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 25px;
  margin: 30px 0;
  flex-wrap: wrap;
`;

const CardStat = styled.div`
  background: white;
  padding: 20px 35px;
  border-radius: 15px;
  min-width: 220px;
  text-align: center;
  cursor: pointer;

  border: ${(props) => props.activo ? "2px solid #4a89dc" : "2px solid transparent"};

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const HeaderModal = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Tabla = styled.table`
  width: 90%;
  margin: 20px auto;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const EncabezadoTabla = styled.thead`
  background-color: #5d9cec;
  color: white;
  text-align: left;
`;

const FilaTabla = styled.tr``;

const CeldaEncabezado = styled.th`
  padding: 12px 15px;
`;

const CuerpoTabla = styled.tbody``;

const Celda = styled.td`
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
  text-align: center;
`;

const ModalFondo = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const ModalContenido = styled.div`
 position: relative; 
  background: white;
  padding: 35px;
  border-radius: 20px;
  width: 520px;
  max-width: 95%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  animation: modalFade 0.25s ease-out;

  @keyframes modalFade {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const BotonCerrar = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;

  background: transparent;
  border: none;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  color: #888;
  transition: 0.2s ease;

  &:hover {
    color: #dc3545;
    transform: scale(1.1);
  }
`;

const BotonAccion = styled.button`
  padding: 10px 15px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
  

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
const BotonGestionar = styled.button`
  background: #4a89dc;
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  color: #ffffff;
  font-weight: 600;
  transition: 0.2s ease;

  &:hover {
    background: #7592b9;
    color: white;
  }
`;

const GrupoInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
`;

const InputEstilizado = styled.input`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.8px solid #e0e0e0;
  font-size: 12px;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: #4a89dc;
    box-shadow: 0 0 0 3px rgba(74, 137, 220, 0.15);
  }
`;

const TextAreaEstilizado = styled.textarea`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.8px solid #e0e0e0;
  font-size: 12px;
  resize: none;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: #4a89dc;
    box-shadow: 0 0 0 3px rgba(74, 137, 220, 0.15);
  }
`;

const CeldaEstado = styled.td`
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
  text-align: center;
  font-weight: bold;
  color: ${(props) => props.color};
`;



const BotonFiltro = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  margin-left: 30px;

  background: ${(props) => (props.activo ? "#4a89dc" : "#e0e0e0")};
  color: ${(props) => (props.activo ? "white" : "#333")};

  box-shadow: ${(props) =>
    props.activo ? "0 5px 15px rgba(0,0,0,0.2)" : "none"};
`;

const traducirEstado = (estado) => {
  switch (estado) {
    case 0:
      return { texto: "Disponible", color: "green" };
    case 1:
      return { texto: "Prestado", color: "purple" };
    case 2:
      return { texto: "Con incidencia", color: "orange" };
    case 3:
      return { texto: "En reparación", color: "blue" };
    case 4:
      return { texto: "Dado de baja", color: "red" };
    default:
      return { texto: "Desconocido", color: "gray" };
  }
};


const IncidenciasMateriales = () => {
  const [materiales, setMateriales] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("incidencias");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState(null);

  useEffect(() => {
    cargarDatos();
    cargarTecnicos();
  }, []);

  const cargarDatos = async () => {
    try {
      const res = await fetch(`http://148.206.162.62:4000/material/incidencias`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMateriales(data);
      } else {
        setMateriales([]);
      }
    } catch (error) {
      console.error("Error al cargar materiales:", error);
    }
  };

  const cargarTecnicos = async () => {
    try {
      const res = await fetch("http://148.206.162.62:4000/tecnicos");
      const data = await res.json();
      setTecnicos(data);
    } catch (error) {
      console.error("Error al cargar técnicos:", error);
    }
  };

  const abrirModal = (material) => {
    setMaterialSeleccionado(material);
    setDescripcion("");
    setTecnicoSeleccionado("");
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setMaterialSeleccionado(null);
  };

  const gestionar = async (nuevoEstado, tipoEvento) => {

    if (nuevoEstado === 3 && !tecnicoSeleccionado) {
      Swal.fire({
        icon: "warning",
        title: "Técnico requerido",
        text: "Debe seleccionar un técnico",
      });
      return;
    }

    if (
      (nuevoEstado === 0 || nuevoEstado === 4) &&
      !descripcion.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Comentario requerido",
        text: "Debe escribir una descripción.",
      });
      return;
    }

    const descripcionFinal =
      descripcion.trim() ||
      (nuevoEstado === 3
        ? materialSeleccionado.comentario
        : "Actualización de estado");

    try {
      console.log("ID que estoy enviando:", materialSeleccionado.id);
      setLoading(true);
      const idEmpleado = localStorage.getItem("idUsuario");

      await fetch(`http://148.206.162.62:4000/material/${materialSeleccionado.id}/gestionar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nuevoEstado,
          descripcion: descripcionFinal,
          idTecnico: nuevoEstado === 3 ? tecnicoSeleccionado : null,
          idEmpleado: idEmpleado
        })
      });

      cerrarModal();
      cargarDatos();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error al gestionar material",
        text: "Hubo un error al gestionar el material.",
      });
    } finally {
      setLoading(false);
    }
  };

  const pendientes = materiales.filter(m => m.estado === 2).length;
  const enReparacion = materiales.filter(m => m.estado === 3).length;
  const materialesFiltrados = materiales.filter((m) => {
    if (filtroEstado === "incidencias") return m.estado === 2;
    if (filtroEstado === "reparacion") return m.estado === 3;
    return true;
  });
  return (
    <>
      <Helmet>
        <title>Gestión de Incidencias Materiales</title>
      </Helmet>

      <Header>
        <ContenedorHeader>
          <Titulo>Gestión de Incidencias de Materiales</Titulo>
        </ContenedorHeader>
      </Header>
      <BotonAtras ruta="/materiales" />


      <ContenedorStats>
        <CardStat
          activo={filtroEstado === "incidencias"}
          onClick={() => setFiltroEstado("incidencias")}
        >
          <h2 style={{ color: "#f6c23e" }}>{pendientes}</h2>
          <p>Incidencias Pendientes</p>
        </CardStat>

        <CardStat
          activo={filtroEstado === "reparacion"}
          onClick={() => setFiltroEstado("reparacion")}
        >
          <h2 style={{ color: "#4a89dc" }}>{enReparacion}</h2>
          <p>En Reparación</p>
        </CardStat>
      </ContenedorStats>

      <Tabla>
        <EncabezadoTabla>
          <FilaTabla>
            <CeldaEncabezado>ID</CeldaEncabezado>
            <CeldaEncabezado>Material</CeldaEncabezado>
            <CeldaEncabezado>Fecha incidencia</CeldaEncabezado>
            {filtroEstado === "incidencias" && (
              <CeldaEncabezado>Préstamo</CeldaEncabezado>
            )}

            <CeldaEncabezado>Reportado por</CeldaEncabezado>
            <CeldaEncabezado>Comentario</CeldaEncabezado>
            {filtroEstado === "reparacion" && (
              <CeldaEncabezado>Técnico</CeldaEncabezado>
            )}
            <CeldaEncabezado>Estado</CeldaEncabezado>
            <CeldaEncabezado>Acción</CeldaEncabezado>

          </FilaTabla>
        </EncabezadoTabla>
        <CuerpoTabla>
          {materialesFiltrados.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                No hay materiales en esta sección
              </td>
            </tr>
          ) : (
            materialesFiltrados.map((m) => {
              const estadoInfo = traducirEstado(m.estado);
              return (
                <FilaTabla key={m.id}>
                  <Celda>{m.id}</Celda>
                  <Celda>{m.nombre}</Celda>
                  <Celda>
                    {m.fecha ? new Date(m.fecha).toLocaleDateString() : "-"}
                  </Celda>
                  {filtroEstado === "incidencias" && (
                    <Celda>{m.idprestamo}</Celda>
                  )}
                  <Celda>{m.reportadoPor}</Celda>
                  <Celda>{m.comentario}</Celda>
                  {filtroEstado === "reparacion" && (
                    <Celda>{m.tecnico || "Sin asignar"}</Celda>
                  )}
                  <CeldaEstado color={estadoInfo.color}>
                    {estadoInfo.texto}
                  </CeldaEstado>
                  <Celda>
                    <BotonGestionar onClick={() => abrirModal(m)}>
                      Gestionar
                    </BotonGestionar>
                  </Celda>


                </FilaTabla>
              );
            })
          )}
        </CuerpoTabla>
      </Tabla>

      {modalOpen && materialSeleccionado && (
        <ModalFondo>
          <ModalContenido>

            <HeaderModal>
              <h3 style={{ color: "#000000", margin: 0 }}>
                Gestionar Material
              </h3>
            </HeaderModal>

            <div className="mb-3">
              <p className="mb-1">
                <strong>Material:</strong> {materialSeleccionado.nombre}
              </p>

              <p className="mb-1">
                <strong>Estado actual:</strong>{" "}
                <span className={`badge ${materialSeleccionado.estado === 2
                  ? "bg-warning"
                  : materialSeleccionado.estado === 3
                    ? "bg-info"
                    : "bg-secondary"
                  }`}>
                  {traducirEstado(materialSeleccionado.estado).texto}
                </span>
              </p>
            </div>

            <GrupoInput>
              <Label>
                Descripción:
              </Label>
              <TextAreaEstilizado
                rows="3"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                error={!descripcion.trim()}
              />
            </GrupoInput>

            {materialSeleccionado.estado === 2 && (
              <GrupoInput>
                <Label>Técnico asignado *</Label>
                <select
                  value={tecnicoSeleccionado}
                  onChange={(e) => setTecnicoSeleccionado(e.target.value)}
                  style={{
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1.8px solid #e0e0e0",
                  }}
                >
                  <option value="">Seleccione un técnico</option>
                  {tecnicos.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre_completo}
                    </option>
                  ))}
                </select>
              </GrupoInput>
            )}

            <div className="d-grid gap-2">

              {materialSeleccionado.estado === 2 && (
                <>
                  <BotonAccion
                    style={{ background: "#4a89dc", color: "white" }}
                    disabled={loading}
                    onClick={() => gestionar(3, 3)}
                  >
                    Enviar a reparación
                  </BotonAccion>

                  <BotonAccion
                    style={{ background: "#28a745", color: "white" }}
                    disabled={loading}
                    onClick={() => gestionar(0, 0)}
                  >
                    Resolver sin reparación
                  </BotonAccion>

                  <BotonAccion
                    style={{ background: "#dc3545", color: "white" }}
                    disabled={loading}
                    onClick={() => gestionar(4, 4)}
                  >
                    Dar de baja
                  </BotonAccion>
                </>
              )}

              {materialSeleccionado.estado === 3 && (
                <>
                  <BotonAccion
                    style={{ background: "#28a745", color: "white" }}
                    disabled={loading}
                    onClick={() => gestionar(0, 7)}
                  >
                    Marcar como reparado
                  </BotonAccion>

                  <BotonAccion
                    style={{ background: "#dc3545", color: "white" }}
                    disabled={loading}
                    onClick={() => gestionar(4, 4)}
                  >
                    Dar de baja
                  </BotonAccion>
                </>
              )}
            </div>

            <BotonCerrar onClick={cerrarModal}>
              ✕
            </BotonCerrar>

          </ModalContenido>
        </ModalFondo>
      )}
    </>
  );
};

export default IncidenciasMateriales;