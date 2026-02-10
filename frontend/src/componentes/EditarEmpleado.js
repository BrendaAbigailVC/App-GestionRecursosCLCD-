import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { Select } from "../elementos/ElementosDeFormulario";
import styled from "styled-components";
import {
  Header,
  Titulo,
  ContenedorHeader,
  Subtitulo,
} from "../elementos/Header";
import Boton from "../elementos/Boton";
import {
  TitutuloSecciones,
  FormularioRegistroSecciones,
  Input2,
  ContenedorBoton,
  FormularioRegistro,
} from "../elementos/ElementosDeFormulario";
import imagen1 from "../imagenes/motasPantera4.png";
import BotonAtras from "../elementos/BotonAtras";
import FormularioEmpleado from "../elementos/FormularioEmpleado";
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

const EditarEmpleado = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    noEconomico: "",
    password: "",
    repeatPassword: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correoInstitucional: "",
    estado: "",
    tipo: "",
  });
  const [erroresMensaje, setErroresMensaje] = useState({});
  const [tiposEmpleado, setTiposEmpleado] = useState([]);
  const [estadosEmpleado, setEstadosEmpleado] = useState([]);

  const validarEmpleado = () => {
    const error = {};
    if (!formData.nombre.trim()) error.nombre = "El nombre es requerido";
    if (!formData.apellidoPaterno.trim()) error.apellidoPaterno = "El apellido paterno es requerido";
    if (!formData.apellidoMaterno.trim()) error.apellidoMaterno = "El apellido materno es requerido";
    if (formData.password) {
      if (formData.password.length < 8) {
        error.password = "La contraseña debe tener al menos 8 caracteres";
      }
      if (formData.password !== formData.repeatPassword) {
        error.password = "Las contraseñas no coinciden";
        error.repeatPassword = "Las contraseñas no coinciden";
      }
    }
    if (!formData.noEconomico)
      error.noEconomico = "El número económico es requerido";
    else if (!/^[1-9][0-9]{4}$/.test(formData.noEconomico))
      error.noEconomico = "Debe tener exactamente 5 dígitos y no iniciar con 0";


    if (!formData.tipo) error.tipo = "Seleccione un cargo";
    if (!formData.estado) error.estado = "Seleccione un estado";

    if (!formData.correoInstitucional)
      error.correoInstitucional = "El correo es requerido";
    else if (!formData.correoInstitucional.endsWith("@cua.uam.mx"))
      error.correoInstitucional = "Debe terminar en @cua.uam.mx";

    return error;
  };

  useEffect(() => {
    const fetchEmpleado = async () => {
      try {
        const response = await fetch(`http://148.206.162.62:4000/empleado/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            noEconomico: data.noeconomico || "",
            password: "",
            repeatPassword: "",
            nombre: data.nombre || "",
            apellidoPaterno: data.apellidopaterno || "",
            apellidoMaterno: data.apellidomaterno || "",
            correoInstitucional: data.correoinstitucional || "",
            estado: data.estado !== null ? String(data.estado) : "",
            tipo: data.tipo !== null ? String(data.tipo) : "",
          });
        }
      } catch (error) {
        console.error("Error al cargar empleado:", error);
      }
    };

    const fetchTipos = async () => {
      const res = await fetch("http://148.206.162.62:4000/tipos-empleado");
      const data = await res.json();
      setTiposEmpleado(data);
    };

    const fetchEstados = async () => {
      const res = await fetch("http://148.206.162.62:4000/estados-empleado");
      const data = await res.json();
      setEstadosEmpleado(data);
    };

    if (id) {
      fetchEmpleado();
      fetchTipos();
      fetchEstados();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "noEconomico" && value !== "" && !/^\d+$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
    setErroresMensaje((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errores = validarEmpleado();
    setErroresMensaje(errores);
    if (Object.keys(errores).length > 0) return;

    try {
      const empleadoData = {
        noEconomico: formData.noEconomico,
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        correoInstitucional: formData.correoInstitucional,
        estado: parseInt(formData.estado),
        tipo: parseInt(formData.tipo),
      };

      if (formData.password) {
        empleadoData.password = formData.password;
      }

      const response = await fetch(`http://148.206.162.62:4000/empleado/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empleadoData),
      });

      if (response.ok) {
        alert("Datos del empleado actualizados con éxito");
        navigate("/mostrar-empleados");
      } else {
        const errorData = await response.json();
        console.error("Error al actualizar:", errorData);
        alert("Error al actualizar empleado");
      }
    } catch (error) {
      console.error("Error al enviar solicitud PUT:", error);
      alert("Ocurrió un error al actualizar empleado");
    }
  };

  return (
    <>
      <Helmet>
        <title>Edición de empleado</title>
      </Helmet>

      <Header>
        <ContenedorHeader>
          <Titulo>Edición de empleado</Titulo>
        </ContenedorHeader>
      </Header>

      <BotonAtras ruta="/mostrar-empleados" />
      <ImagenMotas src={imagen1} alt="MotasUam" />

      <FormularioEmpleado
        formData={formData}
        erroresMensaje={erroresMensaje}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        modo="Editar"
        tiposEmpleado={tiposEmpleado}
        estadosEmpleado={estadosEmpleado}
      />
    </>
  );
};

export default EditarEmpleado;
