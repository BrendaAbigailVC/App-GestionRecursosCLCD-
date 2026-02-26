import { Header, Titulo, ContenedorHeader } from "../elementos/Header";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import BotonAtras from "../elementos/BotonAtras";

const Contenedor = styled.div`
  width: 90%;
  margin: 20px auto;
`;

const TarjetaResumen = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Tabla = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const EncabezadoTabla = styled.thead`
  background-color: #5d9cec;
  color: white;
`;

const CeldaEncabezado = styled.th`
  padding: 12px 15px;
  text-align: center;
`;

const Celda = styled.td`
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
  text-align: center;
`;

const CeldaEvento = styled.td`
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
  text-align: center;
  font-weight: bold;
  color: ${(props) => props.color};
`;

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

const traducirEvento = (tipo) => {
  switch (tipo) {
    case 3:
      return { texto: "Enviado a reparación", color: "purple" };
    case 7:
      return { texto: "Material reparado", color: "green" };
    case 6:
      return { texto: "Incidencia resuelta", color: "orange" };
    case 4:
      return { texto: "Material dado de baja", color: "red" };
    default:
      return { texto: "Evento desconocido", color: "gray" };
  }
};

const HistorialMaterial = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [material, setMaterial] = useState(null);
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        obtenerMaterial();
        obtenerEventos();
    }, []);

    const obtenerMaterial = async () => {
        try {
            const response = await fetch(
                `http://148.206.162.62:4000/material/${id}`
            );

            if (!response.ok) throw new Error("Material no encontrado");

            const data = await response.json();
            setMaterial(data);
        } catch (error) {
            console.error("Error al obtener material:", error);
        }
    };

    const obtenerEventos = async () => {
        try {
            const response = await fetch(
                `http://148.206.162.62:4000/material/${id}/historial`
            );

            if (!response.ok) {
                setEventos([]);
                return;
            }

            const data = await response.json();
            setEventos(data);
        } catch (error) {
            console.error("Error al obtener eventos:", error);
        }
    };

    return (
        <>
            <Helmet>
                <title>Historial Material</title>
            </Helmet>

            <Header>
                <ContenedorHeader>
                    <Titulo>Historial del Material</Titulo>
                </ContenedorHeader>
            </Header>

            <BotonAtras ruta="/mostrar-materiales" />

            <Contenedor>
                {material && (
                    <TarjetaResumen>
                        <h3>{material.nombrematerial}</h3>
                        <p><strong>ID:</strong> {material.id}</p>
                        <p><strong>Marca:</strong> {material.marca}</p>
                        <p><strong>Modelo:</strong> {material.modelo}</p>
                        <p>
                            <strong>Estado actual:</strong> {traducirEstado(material.estado)}
                        </p>
                    </TarjetaResumen>
                )}

                <Tabla>
                    <EncabezadoTabla>
                        <tr>
                            <CeldaEncabezado>Fecha</CeldaEncabezado>
                            <CeldaEncabezado>Evento</CeldaEncabezado>
                            <CeldaEncabezado>Usuario</CeldaEncabezado>
                            <CeldaEncabezado>Comentario</CeldaEncabezado>
                        </tr>
                    </EncabezadoTabla>

                    <tbody>
                        {eventos.map((evento) => {
                            const info = traducirEvento(evento.tipo_evento);

                            return (
                                <tr key={evento.id}>
                                    <Celda>
                                        {new Date(evento.fecha_evento).toLocaleString("es-MX")}
                                    </Celda>

                                    <CeldaEvento color={info.color}>
                                        {info.texto}
                                    </CeldaEvento>

                                    <Celda>{evento.nombre_empleado}</Celda>

                                    <Celda>{evento.descripcion_evento}</Celda>
                                </tr>
                            );
                        })}
                    </tbody>
                </Tabla>
            </Contenedor>
        </>
    );
};

export default HistorialMaterial;