import React, { useState } from "react";
import { Header, Titulo, ContenedorHeader } from "../elementos/Header";
import Boton from "../elementos/Boton";
import BotonAtras from "../elementos/BotonAtras";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import {
  TitutuloSecciones,
  FormularioRegistroSecciones,
  Select,
  Input2,
  ContenedorBoton,
  FormularioRegistro,
} from "../elementos/ElementosDeFormulario";
import imagen1 from "../imagenes/motasPantera4.png";
import MensajeConError from "../elementos/MensajeError";
const ImagenMotas = styled.img`
  position: absolute;
  top: 12%;
  left: 76%;
  width: 75% 5%;
  height: 120%;
  z-index: -1;
  @media (max-width: 768px) {
    margin-left: 0;
    width: 24%;
    height: 80%;
    left: 76%;
  }
`;

const RegistrarMaterial = () => {
  const [erroresMensaje, setErroresMensaje] = useState({});
  const [formData, setFormData] = useState({
    inventarioUAM: "",
    inventarioCoordinacion: "",
    marca: "",
    modelo: "",
    numeroSerie: "",
    estado: "",
    nombreMaterial: "",
    cantidad: "",
    tipo: "",
    descripcion: "",
  });

  const validarMaterial = (data = formData) => {
    const error = {};

    if (!data.inventarioUAM.trim()) error.inventarioUAM = "El inventario UAM es obligatorio";

    if (!data.inventarioCoordinacion.trim()) error.inventarioCoordinacion = "El inventario de coordinación es obligatorio";

    if (!data.marca.trim()) error.marca = "La marca es obligatoria";

    if (!data.modelo.trim()) error.modelo = "El modelo es obligatorio";

    if (!data.numeroSerie.trim()) error.numeroSerie = "El número de serie es obligatorio";
    else if (data.numeroSerie.length < 5) error.numeroSerie = "El número de serie debe tener al menos 5 dígitos";

    if (!data.nombreMaterial.trim()) error.nombreMaterial = "El nombre del material es obligatorio";

    if (!data.tipo) error.tipo = "Selecciona un tipo de material";

    if (data.tipo !== "1") {
      if (!data.cantidad)
        error.cantidad = "La cantidad es obligatoria";
      else if (parseInt(data.cantidad) <= 0)
        error.cantidad = "La cantidad debe ser mayor a 0";
    }

    if (!data.descripcion.trim())
      error.descripcion = "La descripción es obligatoria";

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      (name === "numeroSerie" || name === "cantidad") &&
      value &&
      !/^\d+$/.test(value)
    ) {
      return;
    }

    let nuevosDatos = { ...formData, [name]: value };

    if (name === "cantidad") {
      const cantidadNum = value ? parseInt(value) : 0;
      nuevosDatos = {
        ...formData,
        cantidad: value,
        estado: cantidadNum > 0 ? 0 : 1,
      };
    }

    if (name === "tipo") {
      if (value === "0") {
        nuevosDatos = {
          ...formData,
          tipo: value,
          cantidad: "1",
          estado: 0,
        };
      } else {
        nuevosDatos = {
          ...formData,
          tipo: value,
        };
      }
    }

    setFormData(nuevosDatos);
    const errores = validarMaterial(nuevosDatos);
    setErroresMensaje((prev) => ({
      ...prev,
      [name]: errores[name],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errores = validarMaterial();
    setErroresMensaje(errores);
     if (Object.keys(errores).length > 0) { return; }

    /*for (const campo in formData) {
      if (formData[campo] === "" || formData[campo] === null) {
        alert(`Por favor, completa el campo: ${campo}`);
        return;
      }
    }*/

    try {
      const response = await fetch("http://148.206.162.62:4000/material", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          numeroSerie: formData.numeroSerie
            ? parseInt(formData.numeroSerie)
            : null,
          cantidad: formData.cantidad ? parseInt(formData.cantidad) : null,
          estado: parseInt(formData.estado),
          tipo: parseInt(formData.tipo),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al registrar material");
      }

      alert("Material registrado con éxito");
      setFormData({
      inventarioUAM: "",
      inventarioCoordinacion: "",
      marca: "",
      modelo: "",
      numeroSerie: "",
      estado: "",
      nombreMaterial: "",
      cantidad: "",
      tipo: "",
      descripcion: "",
    });
    } catch (error) {
      console.error("Error al registrar material:", error.message);
      alert(`Hubo un error al registrar el material: ${error.message}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Registrar Material</title>
      </Helmet>

      <Header>
        <ContenedorHeader>
          <Titulo>Registro de Material</Titulo>
        </ContenedorHeader>
      </Header>

      <BotonAtras ruta="/materiales" />
      <ImagenMotas src={imagen1} alt="MotasUam" />

      <FormularioRegistro onSubmit={handleSubmit}>
        <FormularioRegistroSecciones>
          <TitutuloSecciones>Datos del Material</TitutuloSecciones>
          Inventario UAM
          <Input2
            type="text"
            name="inventarioUAM"
            value={formData.inventarioUAM}
            onChange={handleChange}
            error={erroresMensaje.inventarioUAM}
          />
           <MensajeConError error={erroresMensaje.inventarioUAM} />
          Inventario Coordinación
          <Input2
            type="text"
            name="inventarioCoordinacion"
            value={formData.inventarioCoordinacion}
            onChange={handleChange}
            error={erroresMensaje.inventarioCoordinacion}
          />
          <MensajeConError error={erroresMensaje.inventarioCoordinacion} />
          Marca
          <Input2
            type="text"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            error={erroresMensaje.marca}
          />
          <MensajeConError error={erroresMensaje.marca} />
          Modelo
          <Input2
            type="text"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            error={erroresMensaje.modelo}
          />
          <MensajeConError error={erroresMensaje.modelo}
          />
          Número de Serie
          <Input2
            type="text"
            name="numeroSerie"
            value={formData.numeroSerie}
            onChange={handleChange}
            error={erroresMensaje.numeroSerie}
          />
          <MensajeConError error={erroresMensaje.numeroSerie} />
          Nombre del Material
          <Input2
            type="text"
            name="nombreMaterial"
            value={formData.nombreMaterial}
            onChange={handleChange}
            error={erroresMensaje.nombreMaterial}
          />
          <MensajeConError error={erroresMensaje.nombreMaterial}/>
          Cantidad
          <Input2
            type="text"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            disabled={formData.tipo === "0"}
            error={erroresMensaje.cantidad}
          />
          <MensajeConError error={erroresMensaje.cantidad} />
          Estado
          <Select name="estado" value={formData.estado} disabled>
            <option value="">Seleccione Estado</option>
            <option value="0">Disponible</option>
            <option value="1">Sin Disponibilidad</option>
          </Select>
          Tipo
          <Select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            error={erroresMensaje.tipo}
          >
            <option value="">Seleccione Tipo</option>
            <option value="0">Inventariado</option>
            <option value="1">Consumible</option>
          </Select>
          <MensajeConError error={erroresMensaje.tipo} />
          Descripción
          <Input2
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            error={erroresMensaje.descripcion}
          />
          <MensajeConError error={erroresMensaje.descripcion} />
        </FormularioRegistroSecciones>

        <ContenedorBoton>
          <Boton as="button" type="submit">
            Registrar Material
          </Boton>
        </ContenedorBoton>
      </FormularioRegistro>
    </>
  );
};

export default RegistrarMaterial;
