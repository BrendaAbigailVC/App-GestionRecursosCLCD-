import {
  Header,
  Titulo,
  ContenedorHeader,
  Subtitulo,
} from "../elementos/Header";
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

const RegistrarAlumno = () => {
  const navigate = useNavigate();
  const [erroresMensaje, setErroresMensaje] = useState({});
  const [formData, setFormData] = useState({
    matricula: "",
    password: "",
    repeatPassword: "",
    nombre: "",
    apellidop: "",
    apellidom: "",
    unidad: "",
    division: "",
    licenciatura: "",
    estado: "",
    correoinstitucional: "",
    observaciones: "",
  });

  const validarAlumno = (data) => {
    const error = {};

    if (!data.nombre.trim()) { error.nombre = "El nombre es requerido"; }
    if (!data.apellidop.trim()) { error.apellidop = "El apellido paterno es requerido"; }
    if (!data.apellidom.trim()) { error.apellidom = "El apellido materno es requerido"; }

    if (!data.password) { 
      error.password = "La contraseña es requerida."; 
    } else if (data.password.length < 8) {
      error.password = "La contraseña debe tener al menos 8 caracteres.";
    } 

    if (data.password && data.repeatPassword && data.password !== data.repeatPassword) {
      error.repeatPassword = "Las contraseñas no coinciden";
    }

    if (!data.correoinstitucional) error.correoinstitucional = "El correo es requerido";
    else if (!data.correoinstitucional.endsWith("@cua.uam.mx")) {
      error.correoinstitucional = "El correo debe terminar en @cua.uam.mx";
    }

    if (!data.matricula) { error.matricula = "La matrícula es requerida"; }
    else if (data.matricula.length !== 10) { error.matricula = "El formato de la matrícula es incorrecto"; }

    if (!data.unidad) { error.unidad = "Seleccione una unidad"; }
    if (!data.licenciatura) { error.licenciatura = "Seleccione una licenciatura"; }
    if (!data.estado) { error.estado = "Seleccione el estado del alumno"; }

    return error;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "matricula" && !/^[0-9]*$/.test(value)) {
      return;
    }
    let nuevosDatos = { ...formData, [name]: value };

    if (name === "licenciatura") {
      if (["131", "141", "144", "132"].includes(value)) {
        nuevosDatos.division = "CNI";
      } else if (["130", "137", "138"].includes(value)) {
        nuevosDatos.division = "CCD";
      } else if (["128", "129", "135", "136"].includes(value)) {
        nuevosDatos.division = "CSH";
      } else {
        nuevosDatos.division = "";
      }
    }

    setFormData(nuevosDatos);

    if (erroresMensaje[name]) {
      setErroresMensaje({
        ...erroresMensaje,
        [name]: undefined
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errores = validarAlumno(formData);
    setErroresMensaje(errores);

    if (Object.keys(errores).length > 0) { return; }

    try {
      const response = await fetch("http://148.206.162.62:4000/alumno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, sancion: 0 }),
      });

      const data = await response.json();
      console.log("Alumno registrado:", data);
      alert("Alumno registrado con éxito");
      navigate("/registro-usuarios");
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error al registrar al alumno");
    }
  };

  return (
    <>
      <Helmet>
        <title>Registrar Alumno</title>
      </Helmet>

      <Header>
        <ContenedorHeader>
          <Titulo>Registro de Alumno</Titulo>
        </ContenedorHeader>
      </Header>

      <BotonAtras ruta="/registro-usuarios" />

      <ImagenMotas src={imagen1} alt="MotasUam" />

      <FormularioRegistro onSubmit={handleSubmit}>
        <FormularioRegistroSecciones>
          <TitutuloSecciones>Datos de Contacto</TitutuloSecciones>
          <Subtitulo>
            Nombre
            <Input2
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre(s)"
              error={erroresMensaje.nombre}
            />
            <MensajeConError error={erroresMensaje.nombre} />
            <Input2
              type="text"
              name="apellidop"
              value={formData.apellidop}
              onChange={handleChange}
              placeholder="Apellido Paterno"
              error={erroresMensaje.apellidop}
            />
            <MensajeConError error={erroresMensaje.apellidop} />
            <Input2
              type="text"
              name="apellidom"
              value={formData.apellidom}
              onChange={handleChange}
              placeholder="Apellido Materno"
              error={erroresMensaje.apellidom}
            />
            <MensajeConError error={erroresMensaje.apellidom} />
          </Subtitulo>
        </FormularioRegistroSecciones>

        <FormularioRegistroSecciones>
          <TitutuloSecciones>Datos de la Cuenta</TitutuloSecciones>
          <Input2
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"
            error={erroresMensaje.password}
          />
          <MensajeConError error={erroresMensaje.password} />
          <Input2
            type="password"
            name="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleChange}
            placeholder="Repetir Contraseña"
            error={erroresMensaje.repeatPassword}
          />
          <MensajeConError error={erroresMensaje.repeatPassword} />
        </FormularioRegistroSecciones>

        <FormularioRegistroSecciones>
          <TitutuloSecciones>Datos del Alumno</TitutuloSecciones>
          <Input2
            type="text"
            name="matricula"
            value={formData.matricula}
            onChange={handleChange}
            placeholder="Matrícula"
            error={erroresMensaje.matricula}
          />
          <MensajeConError error={erroresMensaje.matricula} />
          <Select
            name="unidad"
            value={formData.unidad}
            onChange={handleChange}
            error={erroresMensaje.unidad}
          >
            <option value="">Seleccione Unidad</option>
            <option value="1">Azcapotzalco</option>
            <option value="2">Iztapalapa</option>
            <option value="3">Xochimilco</option>
            <option value="4">Cuajimalpa</option>
            <option value="5">Lerma</option>
          </Select>
          <MensajeConError error={erroresMensaje.unidad} />
          <Select
            name="licenciatura"
            value={formData.licenciatura}
            onChange={handleChange}
            error={erroresMensaje.licenciatura}
          >
            <option value="">Seleccione Licenciatura</option>
            <option value="131">Ingeniería en Computación</option>
            <option value="141">Ingeniería Biológica</option>
            <option value="144">Biología Molecular</option>
            <option value="132">Matemáticas Aplicadas</option>
            <option value="130">Diseño</option>
            <option value="137">Tecnologías y Sistemas de Información</option>
            <option value="138">Ciencias de la Comunicación</option>
            <option value="128">Administración</option>
            <option value="129">Derecho</option>
            <option value="135">Estudios Socioterritoriales</option>
            <option value="136">Humanidades</option>
          </Select>
          <MensajeConError error={erroresMensaje.licenciatura} />
          <Input2
            type="text"
            name="division"
            value={formData.division}
            placeholder="División"
            readOnly
          />

          <Select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            error={erroresMensaje.estado}
          >
            <option value="">Seleccione Estado</option>
            <option value="1">Inscrito</option>
            <option value="2">No inscrito</option>
          </Select>
          <MensajeConError error={erroresMensaje.estado} />
          <Input2
            type="text"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            placeholder="Observaciones"
          />
          <Input2
            type="email"
            name="correoinstitucional"
            value={formData.correoinstitucional}
            onChange={handleChange}
            placeholder="Correo Institucional"
            error={erroresMensaje.correoinstitucional}
          />
          <MensajeConError error={erroresMensaje.correoinstitucional} />
        </FormularioRegistroSecciones>

        <ContenedorBoton>
          <Boton as="button" type="submit">
            Registrar Alumno
          </Boton>
        </ContenedorBoton>
      </FormularioRegistro>
    </>
  );
};

export default RegistrarAlumno;