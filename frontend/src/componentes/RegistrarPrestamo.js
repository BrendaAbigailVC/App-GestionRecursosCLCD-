import React, { useState, useEffect } from "react";
import { Header, Titulo, ContenedorHeader } from "../elementos/Header";
import Boton from "../elementos/Boton";
import BotonAtras from "../elementos/BotonAtras";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  TitutuloSecciones,
  FormularioRegistro,
  FormularioRegistroSecciones,
  Input2,
  Select,
  ContenedorBoton,
} from "../elementos/ElementosDeFormulario";
import MensajeConError from "../elementos/MensajeError"
import Swal from "sweetalert2";

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
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
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
  text-align: center;
`;

const CeldaEncabezado = styled.th`
  padding: 12px 15px;
`;

const FilaTabla = styled.tr``;
const CuerpoTabla = styled.tbody``;
const Celda = styled.td`
  padding: 10px;
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

const SeccionBloque = styled.div`
  opacity: ${props => props.bloqueado ? 0.5 : 1};
  pointer-events: ${props => props.bloqueado ? "none" : "auto"};
  transition: all 0.3s ease;
`;

const ResumenBox = styled.div`
  background: #eaf4ff;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ContenedorAcordeon = styled.div`
  width: 90%;
  margin: 20px auto;
`;

const HeaderSeccion = styled.div`
  background: #5d9cec;
  color: white;
  padding: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  margin-top: 10px;
  opacity: ${props => props.bloqueado ? 0.6 : 1};
  pointer-events: ${props => props.bloqueado ? "none" : "auto"};
`;

const ContenidoSeccion = styled.div`
  overflow: hidden;
  transition: all 0.3s ease;
  max-height: ${props => props.abierto ? "2000px" : "0"};
  padding: ${props => props.abierto ? "20px" : "0 20px"};
  background: #fff;
  border: 1px solid #ddd;
  border-top: none;
`;

const ContenedorTablaScrollable = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const ControlCantidad = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const BotonCantidad = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #5d9cec;
  background: white;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #5d9cec;
    color: white;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const NumeroCantidad = styled.span`
  min-width: 25px;
  text-align: center;
  font-weight: 600;
`;

const LayoutPrincipal = styled.div`
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 1px;
  width: 90%;
  margin: auto;
`;


const ResumenLateral = styled.div`
  background: #ffffff;
  padding: 18px;
  border-radius: 10px;
  height: fit-content;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  position: sticky;
  top: 24px;
  font-size: 14px;
  border: 1px solid #f0f0f0;
`;

const ItemResumen = styled.div`
  border-bottom: 1px solid #f0f0f0;
  padding: 6px 0;
  font-size: 13px;
`;

const TotalResumen = styled.div`
  margin-top: 15px;
  font-weight: bold;
  font-size: 16px;
`;


const RegistrarPrestamo = () => {
  const navigate = useNavigate();
  const idEmpleado = localStorage.getItem("idUsuario");

  const [alumnos, setAlumnos] = useState([]);
  const [busquedaAlumno, setBusquedaAlumno] = useState("");
  const [materiales, setMateriales] = useState([]);
  const [busquedaMaterial, setBusquedaMaterial] = useState("");
  const [carrito, setCarrito] = useState({});
  const [idAlumno, setIdAlumno] = useState("");
  const [idPrestamo, setIdPrestamo] = useState("");
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
  const [erroresMensaje, setErroresMensaje] = useState({});
  const [seccionActiva, setSeccionActiva] = useState("alumno");

  const [datosPrestamo, setDatosPrestamo] = useState({
    fechaPrestamo: "",
    fechaDevolucion: "",
    uea: "",
    grupo: "",
    observaciones: "",
    tipoPrestamo: "",
  });


  useEffect(() => {
    const fetchData = async () => {
      const resMateriales = await fetch("http://148.206.162.62:4000/materiales");
      const dataMateriales = await resMateriales.json();
      setMateriales(dataMateriales);

      const resAlumnos = await fetch("http://148.206.162.62:4000/alumnos");
      const dataAlumnos = await resAlumnos.json();
      setAlumnos(dataAlumnos);

      const resContador = await fetch(
        `http://148.206.162.62:4000/prestamo/contador/${idEmpleado}`
      );
      const { contador } = await resContador.json();
      const consecutivo = String(contador + 1).padStart(6, "0");
      setIdPrestamo(`LABPRES-${idEmpleado}-${consecutivo}`);

      const today = new Date().toISOString().split("T")[0];
      setDatosPrestamo((prev) => ({
        ...prev,
        fechaPrestamo: today,
      }));
    };
    fetchData();
  }, [idEmpleado]);

  const alumnoSeleccionado = alumnos.find(a => a.id === idAlumno);
  const hayMaterial = Object.values(carrito).some(c => c > 0);
  const hayDisponibles = materiales.some(m => m.cantidad > 0);

  useEffect(() => {
    if (idAlumno) {
      setSeccionActiva("materiales");
    }
  }, [idAlumno]);


  const cambiarCantidad = (id, cantidad) => {
    const material = materiales.find((m) => m.id === id);
    if (isNaN(cantidad) || cantidad < 0 || !Number.isInteger(cantidad)) return;
    if (cantidad > material.cantidad) cantidad = material.cantidad;

    setCarrito({ ...carrito, [id]: cantidad });
  };

  const validarCampos = () => {
    let errores = {};

    if (!idAlumno) errores.general = "Selecciona un alumno.";
    if (!hayMaterial) errores.carrito = "Agrega al menos un material.";
    if (!datosPrestamo.tipoPrestamo) errores.tipoPrestamo = "Selecciona tipo.";
    if (!datosPrestamo.uea) errores.uea = "UEA obligatoria.";
    if (!datosPrestamo.grupo) errores.grupo = "Grupo obligatorio.";
    if (!datosPrestamo.fechaPrestamo) errores.fechaPrestamo = "La fecha de préstamo es obligatoria.";
    if (!datosPrestamo.fechaDevolucion) errores.fechaDevolucion = "La fecha de devolución es obligatoria.";


    if (
      datosPrestamo.fechaPrestamo &&
      datosPrestamo.fechaDevolucion &&
      new Date(datosPrestamo.fechaDevolucion) <
      new Date(datosPrestamo.fechaPrestamo)
    ) {
      errores.fechaDevolucion = "La fecha de devolución no puede ser anterior a la de préstamo.";
    }

    for (const [id, cantidad] of Object.entries(carrito)) {
      const material = materiales.find((m) => m.id === id);
      if (
        !Number.isInteger(cantidad) ||
        cantidad < 1 ||
        cantidad > material.cantidad
      ) {
        errores.carrito = (
          `La cantidad para el material "${material?.nombrematerial || id
          }" debe ser al menos 1 y no mayor que la disponible (${material?.cantidad || 0
          }).`
        );
        break;
      }
    }
    setErroresMensaje(errores);
    return Object.keys(errores).length === 0;
  };

  const generarVistaPrevia = () => {
    if (validarCampos()) setMostrarVistaPrevia(true);
  };

  const confirmarPrestamo = async () => {
    const materialesPrestamo = Object.entries(carrito).map(
      ([idMaterial, cantidad]) => ({ idMaterial, cantidad })
    );

    try {
      const res = await fetch("http://148.206.162.62:4000/prestamo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: idPrestamo,
          idAlumno,
          idEmpleado,
          estadoPrestamo: 0,
          ...datosPrestamo,
          materiales: materialesPrestamo,
        }),
      });

      if (res.ok) {
        setMostrarVistaPrevia(false);
        const alumno = alumnos.find((a) => a.id === idAlumno);
        const materialesTexto = materialesPrestamo
          .map(({ idMaterial, cantidad }) => {
            const mat = materiales.find((m) => m.id === idMaterial);
            const nombre = mat?.nombrematerial || "Desconocido";
            return `• ${nombre} (ID: ${idMaterial}): ${cantidad} ${cantidad === 1 ? "unidad" : "unidades"
              }`;
          })
          .join("\n");

        Swal.fire({
          icon: 'success',
          title: 'Préstamo registrado exitosamente',
          text: `Matrícula: ${alumno?.matricula}\n` +
            `Fecha de inicio: ${datosPrestamo.fechaPrestamo}\n` +
            `Fecha de devolución: ${datosPrestamo.fechaDevolucion}\n\n` +
            `Materiales prestados:\n${materialesTexto}`,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });

        setIdAlumno("");
        setDatosPrestamo((prev) => ({
          ...prev,
          fechaPrestamo: new Date().toISOString().split("T")[0],
          fechaDevolucion: "",
          uea: "",
          grupo: "",
          observaciones: "",
          tipoPrestamo: "",
        }));
        setCarrito({});
        navigate("/prestamos");
      } else {
        const error = await res.json();
        alert("Error al registrar préstamo: " + error.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error de red al registrar el préstamo.");
    }
  };

  const alumnosFiltrados = alumnos
    .filter((a) => {
      const filtro = busquedaAlumno.toLowerCase();
      return (
        a.matricula.toLowerCase().includes(filtro) ||
        a.nombre.toLowerCase().includes(filtro) ||
        a.apellidopaterno.toLowerCase().includes(filtro) ||
        a.apellidomaterno.toLowerCase().includes(filtro)
      );
    })
    .slice(0, 3);

  const materialesFiltrados = materiales
    .filter(
      (m) =>
        m.cantidad > 0 &&
        (m.id.toLowerCase().includes(busquedaMaterial.toLowerCase()) ||
          m.nombrematerial.toLowerCase().includes(busquedaMaterial.toLowerCase()))
    );

  useEffect(() => {
    if (datosPrestamo.tipoPrestamo === "0") {
      setDatosPrestamo((prev) => ({
        ...prev,
        fechaDevolucion: prev.fechaPrestamo,
      }));
    }
  }, [datosPrestamo.tipoPrestamo, datosPrestamo.fechaPrestamo]);


  const aumentarCantidad = (id) => {
    setCarrito((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const disminuirCantidad = (id) => {
    setCarrito((prev) => {
      const nuevaCantidad = (prev[id] || 0) - 1;

      if (nuevaCantidad <= 0) {
        const nuevoCarrito = { ...prev };
        delete nuevoCarrito[id];
        return nuevoCarrito;
      }

      return {
        ...prev,
        [id]: nuevaCantidad,
      };
    });
  };

  const totalMateriales = Object.keys(carrito).length;

  const totalUnidades = Object.values(carrito).reduce(
    (acc, cantidad) => acc + cantidad,
    0
  );


  return (
    <>

      <Helmet>
        <title>Registrar Préstamo</title>
      </Helmet>
      <Header>
        <ContenedorHeader>
          <Titulo>Registro de Préstamo</Titulo>
        </ContenedorHeader>
      </Header>
      <BotonAtras ruta="/prestamos" />
      <LayoutPrincipal>
        <FormularioRegistro $ancho="100">
          <FormularioRegistroSecciones $ancho="100%">
            <ContenedorAcordeon>
              <HeaderSeccion
                onClick={() =>
                  setSeccionActiva(
                    seccionActiva === "alumno" ? "" : "alumno"
                  )
                }
              >
                1. Alumno
              </HeaderSeccion>
              <ContenidoSeccion abierto={seccionActiva === "alumno"}>
                <InputBusqueda
                  type="text"
                  placeholder="Buscar por matrícula, nombre o apellido"
                  value={busquedaAlumno}
                  onChange={(e) => {
                    setBusquedaAlumno(e.target.value);
                    setIdAlumno("");
                  }}
                />
                {busquedaAlumno && !idAlumno && (
                  <div
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      maxHeight: "150px",
                      overflowY: "auto",
                      marginBottom: "1rem",
                    }}
                  >
                    {alumnosFiltrados.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          setIdAlumno(a.id);
                          setBusquedaAlumno(
                            `${a.matricula} - ${a.nombre} ${a.apellidopaterno}`
                          );
                        }}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {a.matricula} - {a.nombre} {a.apellidopaterno} {a.apellidomaterno}
                      </div>
                    ))}
                  </div>
                )}
                {idAlumno && (
                  <ResumenBox>
                    <div style={{ marginBottom: "1rem" }}>
                      <strong>Alumno seleccionado:</strong>{" "}
                      {alumnos.find((a) => a.id === idAlumno)?.nombre}{" "}
                      {alumnos.find((a) => a.id === idAlumno)?.apellidopaterno}
                    </div>
                    <button
                      onClick={() => {
                        setIdAlumno("");
                        setBusquedaAlumno("");
                      }}
                      style={{
                        marginLeft: "10px",
                        padding: "2px 8px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Cambiar
                    </button>
                  </ResumenBox>
                )}
              </ContenidoSeccion>
              <SeccionBloque bloqueado={!idAlumno}>
                <HeaderSeccion
                  bloqueado={!idAlumno}
                  onClick={() =>
                    idAlumno &&
                    setSeccionActiva(
                      seccionActiva === "materiales" ? "" : "materiales"
                    )
                  }
                >
                  2. Materiales
                </HeaderSeccion>
                <ContenidoSeccion abierto={seccionActiva === "materiales"}>
                  {!idAlumno && (
                    <MensajeConError>
                      Selecciona un alumno para habilitar materiales.
                    </MensajeConError>
                  )}
                  {idAlumno && (
                    <>
                      <ContenedorBusqueda>
                        <InputBusqueda
                          type="text"
                          placeholder="Buscar material por ID o nombre"
                          value={busquedaMaterial}
                          onChange={(e) => setBusquedaMaterial(e.target.value)}
                        />
                      </ContenedorBusqueda>
                      <ContenedorTablaScrollable>
                        <Tabla>
                          <EncabezadoTabla>
                            <FilaTabla>
                              <CeldaEncabezado>ID</CeldaEncabezado>
                              <CeldaEncabezado>Nombre</CeldaEncabezado>
                              <CeldaEncabezado>Disponible</CeldaEncabezado>
                              <CeldaEncabezado>Cantidad</CeldaEncabezado>
                            </FilaTabla>
                          </EncabezadoTabla>
                          <CuerpoTabla>
                            {materialesFiltrados.map((m) => (
                              <FilaTabla key={m.id}>
                                <Celda>{m.id}</Celda>
                                <Celda>{m.nombrematerial}</Celda>
                                <Celda>{m.cantidad}</Celda>
                                <Celda>
                                  <ControlCantidad>
                                    <BotonCantidad
                                      type="button"
                                      onClick={() => disminuirCantidad(m.id)}
                                      disabled={!carrito[m.id]}
                                    >
                                      -
                                    </BotonCantidad>

                                    <NumeroCantidad>
                                      {carrito[m.id] || 0}
                                    </NumeroCantidad>

                                    <BotonCantidad
                                      type="button"
                                      onClick={() => aumentarCantidad(m.id)}
                                      disabled={(carrito[m.id] || 0) >= m.cantidad}
                                    >
                                      +
                                    </BotonCantidad>
                                  </ControlCantidad>

                                </Celda>
                              </FilaTabla>
                            ))}
                          </CuerpoTabla>
                        </Tabla>
                      </ContenedorTablaScrollable>
                    </>
                  )}
                </ContenidoSeccion>
              </SeccionBloque>
              <SeccionBloque bloqueado={!hayMaterial}>
                <HeaderSeccion
                  bloqueado={!hayMaterial}
                  onClick={() =>
                    hayMaterial &&
                    setSeccionActiva(
                      seccionActiva === "datos" ? "" : "datos"
                    )
                  }
                >
                  3. Datos del Préstamo
                </HeaderSeccion>
                <ContenidoSeccion abierto={seccionActiva === "datos"}>
                  {!hayMaterial && idAlumno && (
                    <MensajeConError>
                      Agrega al menos un material para continuar.
                    </MensajeConError>
                  )}
                  {hayMaterial && (
                    <>
                      No. Económico
                      <Input2 type="text" value={idEmpleado} disabled />
                      ID Préstamo
                      <Input2 type="text" value={idPrestamo} disabled />

                      Tipo de Préstamo
                      <Select
                        name="tipoPrestamo"
                        value={datosPrestamo.tipoPrestamo}
                        onChange={(e) =>
                          setDatosPrestamo({
                            ...datosPrestamo,
                            tipoPrestamo: e.target.value,
                          })
                        }
                      >
                        <option value="">Seleccione</option>
                        <option value="0">Interno</option>
                        <option value="1">Externo</option>
                      </Select>

                      <MensajeConError error={erroresMensaje.tipoPrestamo} />
                      Fecha inicio
                      <Input2
                        type="date"
                        name="fechaPrestamo"
                        value={datosPrestamo.fechaPrestamo}
                        disabled
                      />
                      Fecha devolución
                      <Input2
                        type="date"
                        name="fechaDevolucion"
                        value={datosPrestamo.fechaDevolucion}
                        onChange={(e) =>
                          setDatosPrestamo({
                            ...datosPrestamo,
                            fechaDevolucion: e.target.value,
                          })
                        }
                        disabled={datosPrestamo.tipoPrestamo === "0"}
                        error={erroresMensaje.fechaDevolucion}
                      />
                      <MensajeConError error={erroresMensaje.fechaDevolucion} />
                      UEA
                      <Input2
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        name="uea"
                        value={datosPrestamo.uea}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            setDatosPrestamo({ ...datosPrestamo, uea: value });
                          }
                        }}
                        error={erroresMensaje.uea}
                      />
                      <MensajeConError error={erroresMensaje.uea} />
                      Grupo
                      <Input2
                        type="text"
                        name="grupo"
                        value={datosPrestamo.grupo}
                        onChange={(e) =>
                          setDatosPrestamo({ ...datosPrestamo, grupo: e.target.value })
                        }
                        error={erroresMensaje.grupo}
                      />
                      <MensajeConError error={erroresMensaje.grupo} />
                    </>
                  )}
                </ContenidoSeccion>
              </SeccionBloque>
            </ContenedorAcordeon>
            <ContenedorBoton>
              <Boton
                as="button"
                primario
                disabled={!idAlumno || !hayMaterial}
                onClick={(e) => {
                  e.preventDefault();
                  generarVistaPrevia(true);
                }}
              >
                Generar Préstamo
              </Boton>
            </ContenedorBoton>
          </FormularioRegistroSecciones>
        </FormularioRegistro>
        <ResumenLateral>
          <h4>Resumen del Préstamo</h4>

          {!idAlumno && <p>No hay alumno seleccionado.</p>}

          {idAlumno && (
            <>
              <p>
                <strong>Alumno:</strong><br />
                {alumnoSeleccionado?.nombre} {alumnoSeleccionado?.apellidopaterno}
              </p>

              <hr />

              {Object.keys(carrito).length === 0 && (
                <p>No hay materiales seleccionados.</p>
              )}

              {Object.entries(carrito).map(([idMat, cantidad]) => {
                const mat = materiales.find((m) => m.id === idMat);
                return (
                  <ItemResumen key={idMat}>
                    {mat?.nombrematerial}<br />
                    Cantidad: {cantidad}
                  </ItemResumen>
                );
              })}

              <TotalResumen>
                Total materiales: {totalMateriales}<br />
                Total unidades: {totalUnidades}
              </TotalResumen>
            </>
          )}
        </ResumenLateral>
      </LayoutPrincipal>

      {mostrarVistaPrevia && (
        <ModalFondo>
          <ModalContenido>
            <h3>Confirmar Préstamo</h3>
            <p>
              <strong>Matrícula:</strong>{" "}
              {alumnos.find((a) => a.id === idAlumno)?.matricula}
            </p>
            <p>
              <strong>Fecha inicio:</strong> {datosPrestamo.fechaPrestamo}
            </p>
            <p>
              <strong>Fecha devolución:</strong> {datosPrestamo.fechaDevolucion}
            </p>
            <ul>
              {Object.entries(carrito).map(([idMat, cantidad]) => {
                const mat = materiales.find((m) => m.id === idMat);
                return (
                  <li key={idMat}>
                    {mat?.nombrematerial || "Desconocido"} (ID: {idMat}) –{" "}
                    {cantidad}
                  </li>
                );
              })}
            </ul>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <Boton as="button" onClick={() => setMostrarVistaPrevia(false)}>
                Cancelar
              </Boton>
              <Boton
                as="button"
                primario
                onClick={(e) => {
                  e.preventDefault();
                  confirmarPrestamo();
                }}
              >
                Confirmar
              </Boton>
            </div>
          </ModalContenido>
        </ModalFondo>
      )}
    </>
  );
};

export default RegistrarPrestamo;