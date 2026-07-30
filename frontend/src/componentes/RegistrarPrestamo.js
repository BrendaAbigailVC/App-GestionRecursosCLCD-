import React, { useState, useEffect } from "react";
import { Header, Titulo, ContenedorHeader } from "../elementos/Header";
import Boton from "../elementos/Boton";
import BotonAtras from "../elementos/BotonAtras";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useKeycloak } from '@react-keycloak/web';
import {
  FormularioRegistro,
  FormularioRegistroSecciones,
  Input2,
  Select,
  ContenedorBoton,
} from "../elementos/ElementosDeFormulario";
import MensajeConError from "../elementos/MensajeError";
import Swal from "sweetalert2";
import { API_BASE_URL } from "./config";
const ModalFondo = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4); display: flex;
  align-items: center; justify-content: center; z-index: 10;
`;
const ModalContenido = styled.div` background: white; padding: 30px; border-radius: 10px; width: 500px; max-width: 90%; `;
const Tabla = styled.table` width: 90%; margin: 20px auto; border-collapse: collapse; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); `;
const EncabezadoTabla = styled.thead` background-color: #5d9cec; color: white; text-align: center; `;
const CeldaEncabezado = styled.th` padding: 12px 15px; `;
const FilaTabla = styled.tr``;
const CuerpoTabla = styled.tbody``;
const Celda = styled.td` padding: 10px; border-bottom: 1px solid #ddd; text-align: center; `;
const ContenedorBusqueda = styled.div` width: 90%; margin: 20px auto; display: flex; justify-content: flex-end; `;
const InputBusqueda = styled.input` padding: 10px; width: 300px; border-radius: 5px; border: 1px solid #ccc; font-size: 16px; `;
const SeccionBloque = styled.div` opacity: ${props => props.bloqueado ? 0.5 : 1}; pointer-events: ${props => props.bloqueado ? "none" : "auto"}; transition: all 0.3s ease; `;
const ResumenBox = styled.div` background: #eaf4ff; padding: 10px; border-radius: 8px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; `;
const ContenedorAcordeon = styled.div` width: 90%; margin: 20px auto; `;
const HeaderSeccion = styled.div` background: #5d9cec; color: white; padding: 14px; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-radius: 6px; margin-top: 10px; opacity: ${props => props.bloqueado ? 0.6 : 1}; `;
const ContenidoSeccion = styled.div` overflow: hidden; transition: all 0.3s ease; max-height: ${props => props.abierto ? "2000px" : "0"}; padding: ${props => props.abierto ? "20px" : "0 20px"}; background: #fff; border: 1px solid #ddd; border-top: none; `;
const ContenedorTablaScrollable = styled.div` max-height: 400px; overflow-y: auto; border: 1px solid #ddd; border-radius: 8px; `;
const ControlCantidad = styled.div` display: flex; align-items: center; justify-content: center; gap: 8px; `;
const BotonCantidad = styled.button` width: 28px; height: 28px; border-radius: 6px; border: 1px solid #5d9cec; background: white; cursor: pointer; font-weight: bold; &:hover { background: #5d9cec; color: white; } &:disabled { opacity: 0.4; cursor: not-allowed; } `;
const NumeroCantidad = styled.span` width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: 600; `;
const InputCantidad = styled.input` width: 30px; height: 30px; text-align: center; border: 0.5px solid #ccc; border-radius: 6px; font-weight: 600; `;
const LayoutPrincipal = styled.div` display: grid; grid-template-columns: 1fr 280px; gap: 20px; width: 95%; margin: auto; `;
const ResumenLateral = styled.div` background: #ffffff; padding: 18px; border-radius: 10px; height: fit-content; box-shadow: 0 4px 12px rgba(0,0,0,0.06); position: sticky; top: 24px; font-size: 14px; border: 1px solid #f0f0f0; `;
const ItemResumen = styled.div` border-bottom: 1px solid #f0f0f0; padding: 6px 0; font-size: 13px; `;
const TotalResumen = styled.div` margin-top: 15px; font-weight: bold; font-size: 16px; `;
const RegistrarPrestamo = () => {
  const navigate = useNavigate();
  const { keycloak, initialized } = useKeycloak();
  const idEmpleado = keycloak?.tokenParsed?.sub;
  const [empleados, setEmpleados] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [busquedaSolicitante, setBusquedaSolicitante] = useState("");
  const [materiales, setMateriales] = useState([]);
  const [busquedaMaterial, setBusquedaMaterial] = useState("");
  const [carrito, setCarrito] = useState({});
  const [idPrestamo, setIdPrestamo] = useState("");
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("Solicitante");
  const [solicitante, setSolicitante] = useState(null);
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
      if (!initialized || !keycloak.authenticated) return;
      try {
        const headers = { 'Authorization': `Bearer ${keycloak.token}` };
        const [resMat, resAlu, resEmp, resCont] = await Promise.all([
          fetch(`${API_BASE_URL}/materiales`, { headers }),
          fetch(`${API_BASE_URL}/alumnos`, { headers }),
          fetch(`${API_BASE_URL}/empleados`, { headers }),
          fetch(`${API_BASE_URL}/prestamos/contador/${idEmpleado}`, { headers })
        ]);
        setMateriales(await resMat.json());
        setAlumnos(await resAlu.json());
        setEmpleados(await resEmp.json());
        const { contador } = await resCont.json();
        setIdPrestamo(`LABPRES-${String(contador + 1).padStart(6, "0")}`);
        setDatosPrestamo(prev => ({ ...prev, fechaPrestamo: new Date().toISOString().split("T")[0] }));
      } catch (error) {
        Swal.fire("Error", "No se pudo conectar con el servidor", "error");
      }
    };
    fetchData();
  }, [initialized, keycloak, idEmpleado]);
  const hayMaterial = Object.values(carrito).some(c => c > 0);
  const cambiarCantidad = (id, cantidad) => {
    const material = materiales.find((m) => m.id === id);
    if (isNaN(cantidad) || cantidad < 0) return;
    if (cantidad > material.cantidad) cantidad = material.cantidad;
    setCarrito({ ...carrito, [id]: cantidad });
  };
  const confirmarPrestamo = async () => {
    // Corregido: Mapeamos la propiedad en minúsculas 'idMaterial' -> 'idmaterial' para tu controlador Node
    const materialesPrestamo = Object.entries(carrito)
      .filter(([_, cant]) => cant > 0)
      .map(([idmaterial, cantidad]) => ({ idmaterial, cantidad }));
    try {
      // Corregido: Ajustamos el endpoint para que coincida con router.post('/prestamo')
      const res = await fetch(`${API_BASE_URL}/prestamos/prestamo`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${keycloak.token}` },
        body: JSON.stringify({ 
          id: idPrestamo, 
          solicitante_id: solicitante.id, 
          solicitante_tipo: solicitante.tipo, 
          idEmpleado: solicitante.tipo === "EMPLEADO" ? solicitante.id : 1, // Usa el id entero real del empleado activo
          estadoPrestamo: 0, 
          ...datosPrestamo, 
          materiales: materialesPrestamo 
        }),
      });
      if (res.ok) { 
        Swal.fire("Éxito", "Préstamo registrado correctamente", "success"); 
        navigate("/mostrar-prestamos-activos"); 
      } else { 
        const errData = await res.json();
        Swal.fire("Error", errData.message || "Error al procesar", "error"); 
      }
    } catch (err) { 
      Swal.fire("Error", "Fallo de red", "error"); 
    }
  };
  const solicitantesFiltrados = [
    ...alumnos.map(a => ({ id: a.id, codigo: a.matricula, tipo: "ALUMNO", label: `${a.matricula} - ${a.nombre} ${a.apellidopaterno}`, nombre: `${a.nombre} ${a.apellidopaterno}` })),
    ...empleados.map(e => ({ id: e.id, codigo: e.noeconomico, tipo: "EMPLEADO", label: `${e.noeconomico} - ${e.nombre} ${e.apellidopaterno}`, nombre: `${e.nombre} ${e.apellidopaterno}` }))
  ].filter(s => s.label.toLowerCase().includes(busquedaSolicitante.toLowerCase())).slice(0, 5);
  const materialesFiltrados = materiales.filter(m => m.cantidad > 0 && (m.id.toLowerCase().includes(busquedaMaterial.toLowerCase()) || m.nombrematerial.toLowerCase().includes(busquedaMaterial.toLowerCase())));
  if (!initialized) return <div>Cargando sesión...</div>;
  return (
    <>
      <Helmet><title>Registrar Préstamo</title></Helmet>
      <Header><ContenedorHeader><Titulo>Registro de Préstamo</Titulo></ContenedorHeader></Header>
      <BotonAtras ruta="/prestamos" />
      <LayoutPrincipal>
        <FormularioRegistro $ancho="100">
          <FormularioRegistroSecciones $ancho="100%">
            <ContenedorAcordeon>
              <HeaderSeccion onClick={() => setSeccionActiva(seccionActiva === "Solicitante" ? "" : "Solicitante")}>1. Seleccionar solicitante</HeaderSeccion>
              <ContenidoSeccion abierto={seccionActiva === "Solicitante"}>
                {!solicitante ? (
                  <>
                    <InputBusqueda type="text" placeholder="Buscar matrícula o nombre..." value={busquedaSolicitante} onChange={(e) => setBusquedaSolicitante(e.target.value)} />
                    {busquedaSolicitante && (
                      <div style={{ border: "1px solid #ccc", borderRadius: "5px", marginTop: "5px" }}>
                        {solicitantesFiltrados.map(s => (
                          <div key={`${s.tipo}-${s.id}`} onClick={() => { setSolicitante(s); setSeccionActiva("materiales"); }} style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee" }}>{s.label} ({s.tipo})</div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <ResumenBox>
                    <div><strong>{solicitante.tipo} seleccionado:</strong><br />{solicitante.nombre}</div>
                    <Boton as="button" type="button" onClick={() => { setSolicitante(null); setBusquedaSolicitante(""); }}>Cambiar</Boton>
                  </ResumenBox>
                )}
              </ContenidoSeccion>
              <SeccionBloque bloqueado={!solicitante}>
                <HeaderSeccion onClick={() => solicitante && setSeccionActiva(seccionActiva === "materiales" ? "" : "materiales")}>2. Materiales</HeaderSeccion>
                <ContenidoSeccion abierto={seccionActiva === "materiales"}>
                  <InputBusqueda placeholder="Buscar material..." value={busquedaMaterial} onChange={(e) => setBusquedaMaterial(e.target.value)} />
                  <ContenedorTablaScrollable>
                    <Tabla>
                      <EncabezadoTabla><FilaTabla><CeldaEncabezado>ID</CeldaEncabezado><CeldaEncabezado>Nombre</CeldaEncabezado><CeldaEncabezado>Stock</CeldaEncabezado><CeldaEncabezado>Acción</CeldaEncabezado></FilaTabla></EncabezadoTabla>
                      <CuerpoTabla>
                        {materialesFiltrados.map(m => (
                          <FilaTabla key={m.id}>
                            <Celda>{m.id}</Celda><Celda>{m.nombrematerial}</Celda><Celda>{m.cantidad}</Celda>
                            <Celda>
                              <ControlCantidad>
                                <BotonCantidad type="button" onClick={() => cambiarCantidad(m.id, (carrito[m.id] || 0) - 1)} disabled={!carrito[m.id]}>-</BotonCantidad>
                                <InputCantidad type="number" value={carrito[m.id] || 0} onChange={(e) => cambiarCantidad(m.id, parseInt(e.target.value))} />
                                <BotonCantidad type="button" onClick={() => cambiarCantidad(m.id, (carrito[m.id] || 0) + 1)} disabled={(carrito[m.id] || 0) >= m.cantidad}>+</BotonCantidad>
                              </ControlCantidad>
                            </Celda>
                          </FilaTabla>
                        ))}
                      </CuerpoTabla>
                    </Tabla>
                  </ContenedorTablaScrollable>
                </ContenidoSeccion>
              </SeccionBloque>
              <SeccionBloque bloqueado={!hayMaterial}>
                <HeaderSeccion onClick={() => hayMaterial && setSeccionActiva(seccionActiva === "datos" ? "" : "datos")}>3. Datos del Préstamo</HeaderSeccion>
                <ContenidoSeccion abierto={seccionActiva === "datos"}>
                  <label>Tipo de Préstamo</label>
                  <Select value={datosPrestamo.tipoPrestamo} onChange={(e) => setDatosPrestamo({...datosPrestamo, tipoPrestamo: e.target.value})}><option value="">Seleccione</option><option value="0">Interno</option><option value="1">Externo</option></Select>
                  <label>Fecha Devolución</label><Input2 type="date" value={datosPrestamo.fechaDevolucion} onChange={(e) => setDatosPrestamo({...datosPrestamo, fechaDevolucion: e.target.value})} />
                  <label>UEA</label><Input2 type="text" value={datosPrestamo.uea} onChange={(e) => setDatosPrestamo({...datosPrestamo, uea: e.target.value})} />
                  <label>Grupo</label><Input2 type="text" value={datosPrestamo.grupo} onChange={(e) => setDatosPrestamo({...datosPrestamo, grupo: e.target.value})} />
                </ContenidoSeccion>
              </SeccionBloque>
            </ContenedorAcordeon>
            <ContenedorBoton><Boton as="button" type="button" primario disabled={!solicitante || !hayMaterial} onClick={() => setMostrarVistaPrevia(true)}>Generar Préstamo</Boton></ContenedorBoton>
          </FormularioRegistroSecciones>
        </FormularioRegistro>
        <ResumenLateral>
          <h4>Resumen</h4>
          {solicitante && <p><strong>Para:</strong> {solicitante.nombre}</p>}
          <hr />
          {Object.entries(carrito).map(([id, cant]) => cant > 0 && (<ItemResumen key={id}>{materiales.find(m => m.id === id)?.nombrematerial} (x{cant})</ItemResumen>))}
        </ResumenLateral>
      </LayoutPrincipal>
      {mostrarVistaPrevia && (
        <ModalFondo>
          <ModalContenido>
            <h3>Confirmar Operación</h3><p>¿Deseas registrar el préstamo para {solicitante?.nombre}?</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}><Boton as="button" type="button" onClick={() => setMostrarVistaPrevia(false)}>Cancelar</Boton><Boton as="button" type="button" primario onClick={confirmarPrestamo}>Confirmar</Boton></div>
          </ModalContenido>
        </ModalFondo>
      )}
    </>
  );
};
export default RegistrarPrestamo;