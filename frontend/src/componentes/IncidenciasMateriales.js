import React, { useEffect, useState } from "react";

const backdropStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1050,
};

const modalStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  width: "400px",
};

const traducirEstado = (estado) => {
  switch (estado) {
    case 0: return "Disponible";
    case 1: return "Prestado";
    case 2: return "Con incidencia";
    case 3: return "En reparación";
    case 4: return "Dado de baja";
    default: return "Desconocido";
  }
};

const IncidenciasMateriales = () => {
  const [materiales, setMateriales] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] = useState(null);

  const [descripcion, setDescripcion] = useState("");
  const [nombreTecnico, setNombreTecnico] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
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

  const abrirModal = (material) => {
    setMaterialSeleccionado(material);
    setDescripcion("");
    setNombreTecnico("");
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setMaterialSeleccionado(null);
  };

  const gestionar = async (nuevoEstado, tipoEvento) => {
    if (!descripcion.trim()) {
      alert("La descripción es obligatoria");
      return;
    }

    if (nuevoEstado === 3 && !nombreTecnico.trim()) {
      alert("Debe ingresar el nombre del técnico");
      return;
    }

    try {
      console.log("ID que estoy enviando:", materialSeleccionado.id);
      setLoading(true);
      const idEmpleado = localStorage.getItem("idUsuario");

      await fetch(`http://148.206.162.62:4000/material/${materialSeleccionado.id}/gestionar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nuevoEstado,
          descripcion,
          nombreTecnico: nuevoEstado === 3 ? nombreTecnico : null,
          idEmpleado: idEmpleado
        })
      });

      cerrarModal();
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert("Error al gestionar material");
    } finally {
      setLoading(false);
    }
  };

  const pendientes = materiales.filter(m => m.estado === 2).length;
  const enReparacion = materiales.filter(m => m.estado === 3).length;

  return (
    <div className="container mt-4">

      <h2>Gestión de Incidencias</h2>

      <div className="mb-4">
        <strong>Incidencias pendientes:</strong> {pendientes} <br />
        <strong>En reparación:</strong> {enReparacion}
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Material</th>
            <th>Fecha incidencia</th>
            <th>Préstamo</th>
            <th>Reportado por</th>
            <th>Comentario</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {materiales.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                No hay incidencias abiertas
              </td>
            </tr>
          ) : (
            materiales.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.nombre}</td>
                <td>{m.fecha}</td>
                <td>{m.idprestamo}</td>
                <td>{m.reportadoPor}</td>
                <td>{m.comentario}</td>
                <td>{traducirEstado(m.estado)}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => abrirModal(m)}
                  >
                    🔧 Gestionar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {modalOpen && materialSeleccionado && (
        <div style={backdropStyle}>
          <div style={modalStyle}>

            <h4>Gestionar Material</h4>
            <p><strong>ID:</strong> {materialSeleccionado.id}</p>
            <p><strong>Material:</strong> {materialSeleccionado.nombre}</p>
            <p><strong>Estado actual:</strong> {traducirEstado(materialSeleccionado.estado)}</p>

            <div className="mb-3">
              <label className="form-label">Descripción *</label>
              <textarea
                className="form-control"
                rows="3"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            {materialSeleccionado.estado === 2 && (
              <div className="mb-3">
                <label className="form-label">Nombre del técnico *</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombreTecnico}
                  onChange={(e) => setNombreTecnico(e.target.value)}
                />
              </div>
            )}

            <div className="mb-2">


              {materialSeleccionado.estado === 2 && (
                <>
                  <button
                    className="btn btn-primary me-2"
                    disabled={loading}
                    onClick={() => gestionar(3, 3)}
                  >
                    Enviar a reparación
                  </button>

                  <button
                    className="btn btn-danger me-2"
                    disabled={loading}
                    onClick={() => gestionar(4, 4)}
                  >
                    Dar de baja
                  </button>

                  <button
                    className="btn btn-success"
                    disabled={loading}
                    onClick={() => gestionar(0, 0)}
                  >
                    Resolver sin reparación
                  </button>
                </>
              )}

              {materialSeleccionado.estado === 3 && (
                <>
                  <button
                    className="btn btn-success me-2"
                    disabled={loading}
                    onClick={() => gestionar(0, 7)} 
                  >
                    Marcar como reparado
                  </button>

                  <button
                    className="btn btn-danger"
                    disabled={loading}
                    onClick={() => gestionar(4, 4)}
                  >
                    Dar de baja
                  </button>
                </>
              )}

            </div>

            <div className="mt-3">
              <button
                className="btn btn-secondary"
                onClick={cerrarModal}
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default IncidenciasMateriales;