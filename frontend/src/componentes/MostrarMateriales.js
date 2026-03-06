import { Header, Titulo, ContenedorHeader } from "../elementos/Header";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BotonAtras from "../elementos/BotonAtras";

const SelectFiltro = styled.select`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
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

const ContenedorBusqueda = styled.div`
  width: 90%;
  margin: 20px auto;
  display: flex;
  justify-content: flex-end;
`;

const InputBusqueda = styled.input`
  padding: 10px;
  width: 300px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const BotonEditar = styled.button`
  padding: 8px 12px;
  background-color: #f0ad4e;
  border: none;
  color: white;
  border-radius: 7px;
  cursor: pointer;
  margin-right: 5px;
  &:hover {
    background-color: #ec971f;
  }
`;

const BotonHistorial = styled.button`
  padding: 8px 12px;
  background-color: #5d9cec;
  border: none;
  color: white;
  border-radius: 7px;
  cursor: pointer;
  margin-right: 5px;
  &:hover {
    background-color: #4a89dc;
  }
`;

const traducirEstado = (estado, tipo, cantidad) => {
  if (tipo === 1 && cantidad === 0) {
    return { texto: "Agotado", color: "red" };
  }

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



const CeldaEstado = styled.td`
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
  text-align: center;
  font-weight: bold;
  color: ${(props) => props.color};
`;

const MostrarMateriales = () => {
  const navigate = useNavigate();
  const [materiales, setMateriales] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const obtenerMateriales = async () => {
    try {
      const response = await fetch("http://148.206.162.62:4000/materiales");
      const data = await response.json();
      setMateriales(data);
    } catch (error) {
      console.error("Error al obtener materiales:", error);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("idUsuario");
    const tipo = localStorage.getItem("tipoUsuario");

    if (!id || tipo !== "empleado") {
      navigate("/");
      return;
    }
    obtenerMateriales();
  }, []);

  const materialesFiltrados = materiales.filter((material) => {
    const termino = busqueda.toLowerCase();
    const coincideBusqueda =
      material.id.toLowerCase().includes(termino) ||
      material.nombrematerial.toLowerCase().includes(termino);
    const coincideEstado =
      filtroEstado === "todos" ||
      material.estado.toString() === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  return (
    <>
      <Helmet>
        <title>Mostrar Materiales</title>
      </Helmet>

      <Header>
        <ContenedorHeader>
          <Titulo>Listado de Materiales</Titulo>
        </ContenedorHeader>
      </Header>

      <BotonAtras ruta="/materiales" />

      <ContenedorBusqueda>
        <InputBusqueda
          type="text"
          placeholder="Buscar por ID o nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <SelectFiltro
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          style={{ padding: "10px", marginLeft: "10px" }}
        >
          <option value="todos">Todos</option>
          <option value="0">Disponible</option>
          <option value="1">Prestado</option>
          <option value="2">Con incidencia</option>
          <option value="3">En reparación</option>
          <option value="4">Dado de baja</option>
        </SelectFiltro>
      </ContenedorBusqueda>

      <Tabla>
        <EncabezadoTabla>
          <FilaTabla>
            <CeldaEncabezado>ID</CeldaEncabezado>
            <CeldaEncabezado>Inventario UAM</CeldaEncabezado>
            <CeldaEncabezado>Inventario Coordinación</CeldaEncabezado>
            <CeldaEncabezado>Marca</CeldaEncabezado>
            <CeldaEncabezado>Modelo</CeldaEncabezado>
            <CeldaEncabezado>N° Serie</CeldaEncabezado>
            <CeldaEncabezado>Nombre</CeldaEncabezado>
            <CeldaEncabezado>Cantidad</CeldaEncabezado>
            <CeldaEncabezado>Estado</CeldaEncabezado>
            <CeldaEncabezado>Tipo</CeldaEncabezado>
            <CeldaEncabezado>Acciones</CeldaEncabezado>
          </FilaTabla>
        </EncabezadoTabla>

        <CuerpoTabla>
          {materialesFiltrados.map((material) => {
            const estadoInfo = traducirEstado(
              material.estado,
              material.tipo,
              material.cantidad
            );
            return (
              <FilaTabla key={material.id}>
                <Celda>{material.id}</Celda>
                <Celda>{material.inventario_uam}</Celda>
                <Celda>{material.inventario_coordinacion}</Celda>
                <Celda>{material.marca}</Celda>
                <Celda>{material.modelo}</Celda>
                <Celda>{material.numeroserie}</Celda>
                <Celda>{material.nombrematerial}</Celda>
                <Celda>{material.cantidad}</Celda>


                <CeldaEstado color={estadoInfo.color}>
                  {estadoInfo.texto}
                </CeldaEstado>
                <Celda>
                  {material.tipo === 0 ? "Inventariado" : "Consumible"}
                </Celda>
                <Celda>
                  <BotonEditar
                    onClick={() => navigate(`/editar-material/${material.id}`)}
                  >
                    Editar
                  </BotonEditar>
                  <BotonHistorial
                    onClick={() => navigate(`/historial-material/${material.id}`)}
                  >
                    Historial
                  </BotonHistorial>
                </Celda>
              </FilaTabla>
            );
          })}
        </CuerpoTabla>
      </Tabla>
    </>
  );
};

export default MostrarMateriales;
