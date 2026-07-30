import React from "react";
import {
    TitutuloSecciones,
    FormularioRegistroSecciones,
    Select,
    Input2,
    ContenedorBoton,
    FormularioRegistro,
} from "../elementos/ElementosDeFormulario";
import Boton from "../elementos/Boton";
import MensajeConError from "../elementos/MensajeError";

const FormularioEmpleado = ({ formData, erroresMensaje, handleChange, handleSubmit, modo, tiposEmpleado, estadosEmpleado }) => {

    return (
        <FormularioRegistro onSubmit={handleSubmit}>
            <FormularioRegistroSecciones>
                <TitutuloSecciones>Datos de Contacto</TitutuloSecciones>
                Nombre(s)
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
                    name="apellidoPaterno"
                    value={formData.apellidoPaterno}
                    onChange={handleChange}
                    placeholder="Apellido Paterno"
                    error={erroresMensaje.apellidoPaterno}
                />
                <MensajeConError error={erroresMensaje.apellidoPaterno} />
                <Input2
                    type="text"
                    name="apellidoMaterno"
                    value={formData.apellidoMaterno}
                    onChange={handleChange}
                    placeholder="Apellido Materno"
                    error={erroresMensaje.apellidoMaterno}
                />
                <MensajeConError error={erroresMensaje.apellidoMaterno} />
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
                <MensajeConError error={erroresMensaje.password}
                />
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
                <TitutuloSecciones>Datos del Empleado</TitutuloSecciones>
                No. Economico
                <Input2
                    type="text"
                    name="noEconomico"
                    value={formData.noEconomico}
                    onChange={handleChange}
                    placeholder="Número económico"
                    error={erroresMensaje.noEconomico}
                    disabled={modo === "Editar"} 
                />
                <MensajeConError error={erroresMensaje.noEconomico} />
                Tipo de Cargo
                <Select name="tipo" value={formData.tipo || ""} onChange={handleChange}>
                    <option value="">Seleccione su cargo</option>
                    {tiposEmpleado?.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>
                            {tipo.nombre}
                        </option>
                    ))}
                </Select>
                <MensajeConError error={erroresMensaje.tipo} />
                Estado
                <Select name="estado" value={formData.estado || ""} onChange={handleChange}>
                    {estadosEmpleado?.map((estado) => (
                        <option key={estado.id} value={estado.id}>
                            {estado.nombre}
                        </option>
                    ))}
                </Select>

                <MensajeConError error={erroresMensaje.estado} />

                Correo Institucional
                <Input2
                    type="email"
                    name="correoInstitucional"
                    value={formData.correoInstitucional}
                    onChange={handleChange}
                    placeholder="Correo Institucional"
                    error={erroresMensaje.correoInstitucional}
                />
                <MensajeConError error={erroresMensaje.correoInstitucional} />
            </FormularioRegistroSecciones>

            <ContenedorBoton>
                <Boton as="button" type="submit">
                    {modo === "Editar" ? "Actualizar Datos" : "Registrar Empleado"}
                </Boton>

            </ContenedorBoton>
        </FormularioRegistro>
    );
};
export default FormularioEmpleado;