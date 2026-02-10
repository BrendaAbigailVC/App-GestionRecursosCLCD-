import { useEffect } from "react";
import { Header, Titulo, ContenedorHeader } from "../elementos/Header";
import Boton from "../elementos/Boton";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
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

const RegistrarEmpleado = () => {
  const navigate = useNavigate();
  const [erroresMensaje, setErroresMensaje] = useState({});
  const [tiposEmpleado, setTiposEmpleado] = useState([]);
  const [estadosEmpleado, setEstadosEmpleado] = useState([]);

  const [formData, setFormData] = useState({
    noEconomico: "",
    password: "",
    repeatPassword: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correoInstitucional: "",
    estado: "0",
    tipo: "",
  });

  useEffect(() => {
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

    fetchTipos();
    fetchEstados();
  }, []);

  const validarEmpleado = () => {
    const error = {};

    if (!formData.nombre.trim()) error.nombre = "El nombre es requerido";
    if (!formData.apellidoPaterno.trim()) error.apellidoPaterno = "El apellido paterno es requerido";
    if (!formData.apellidoMaterno.trim()) error.apellidoMaterno = "El apellido materno es requerido";

    if (!formData.password) error.password = "La contraseña es requerida";
    else if (formData.password.length < 8)
      error.password = "La contraseña debe tener al menos 8 caracteres";

    if (formData.password !== formData.repeatPassword) {
      error.password = "Las contraseñas no coinciden";
      error.repeatPassword = "Las contraseñas no coinciden";
    }

    if (!formData.correoInstitucional)
      error.correoInstitucional = "El correo es requerido";
    else if (!formData.correoInstitucional.endsWith("@cua.uam.mx"))
      error.correoInstitucional = "Debe terminar en @cua.uam.mx";

    if (!formData.noEconomico)
      error.noEconomico = "El número económico es requerido";
    else if (!/^[1-9][0-9]{4}$/.test(formData.noEconomico))
      error.noEconomico = "Debe tener 5 dígitos y no iniciar con 0";

    if (!formData.tipo) error.tipo = "Seleccione un cargo";

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "noEconomico" && !/^[0-9]*$/.test(value)) {
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErroresMensaje((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errores = validarEmpleado();
    setErroresMensaje(errores);
    if (Object.keys(errores).length > 0) return;

    try {
      const response = await fetch("http://148.206.162.62:4000/empleado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error();
      //console.log("Empleado registrado:", data);
      alert("Empleado registrado con éxito");
      navigate("/registro-usuarios");
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error al registrar al Empleado");
    }
  };

  return (
    <>
      <Helmet>
        <title>Registrar Empleado</title>
      </Helmet>

      <Header>
        <ContenedorHeader>
          <Titulo>Registro de Empleado</Titulo>
        </ContenedorHeader>
      </Header>
      <ImagenMotas src={imagen1} alt="MotasUam" />
      <BotonAtras ruta="/registro-usuarios" />

      <FormularioEmpleado
        formData={formData}
        erroresMensaje={erroresMensaje}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        modo="Registrar"
        tiposEmpleado={tiposEmpleado}
        estadosEmpleado={estadosEmpleado}
      />
    </>
  );
};

export default RegistrarEmpleado;
