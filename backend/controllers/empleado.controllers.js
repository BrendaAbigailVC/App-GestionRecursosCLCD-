const pool = require("../db");
const { crearUsuarioKeycloak } = require("../services/keycloak.service");
// Obtener todos los empleados con información adicional
const getAllEmpleados = async (req, res, next) => {
  try {
    const allEmpleados = await pool.query(
      `SELECT 
        e.noeconomico, 
        e.nombre, 
        e.apellidopaterno, 
        e.apellidomaterno, 
        e.correoinstitucional, 
        ee.nombre AS estado_nombre, 
        te.nombre AS tipo_nombre
      FROM empleado e
      JOIN tipo_empleado te ON e.tipo = te.id
      JOIN estado_empleado ee ON e.estado = ee.id`
    );
    res.json(allEmpleados.rows);
  } catch (error) {
    next(error);
  }
};

// Obtener un empleado por ID
const getEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT 
        e.noeconomico,
        e.nombre,
        e.apellidopaterno,
        e.apellidomaterno,
        e.correoinstitucional,
        e.estado, 
        e.tipo, 
        ee.nombre AS estado_nombre,
        te.nombre AS tipo_nombre
      FROM empleado e
      JOIN tipo_empleado te ON e.tipo = te.id
      JOIN estado_empleado ee ON e.estado = ee.id
      WHERE e.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const createEmpleado = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const {
      noEconomico,
      password,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      correoInstitucional,
      estado,
      tipo,
    } = req.body;

let rol = "";

switch (Number(tipo)) {
  case 0:
    rol = "COORDINADOR";
    break;
  case 1:
    rol = "TECNICO";
    break;
  case 2:
    rol = "PROFESOR";
    break;
  default:
    throw new Error("Tipo de empleado inválido");
}

const id_keycloak = await crearUsuarioKeycloak({
  username: correoInstitucional,
  email: correoInstitucional,
  password,
  firstName: nombre,
  lastName: `${apellidoPaterno} ${apellidoMaterno}`,
  rol,
});

    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO empleado 
        (id, NoEconomico,password,id_keycloak, Nombre, apellidoPaterno, apellidoMaterno, CorreoInstitucional, Estado, Tipo) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *`,
      [
        noEconomico,
        noEconomico,
        password,
        id_keycloak,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        correoInstitucional,
        estado,
        tipo,
      ]
    );

    const empleado = result.rows[0];

    let permisosAsignar = [];

    if (tipo === 0) {
      permisosAsignar = [0, 1, 2, 3, 4, 5];
    } else if (tipo === 1) {
      permisosAsignar = [0, 1, 2];
    } else if (tipo === 2) {
      permisosAsignar = [1, 2, 4, 5];
    }

    for (const permisoId of permisosAsignar) {
      await client.query(
        `INSERT INTO empleado_permiso (noEconomico, idPermiso) VALUES ($1, $2)`,
        [noEconomico, permisoId]
      );
    }

    await client.query("COMMIT");
    res.json(empleado);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear empleado:", error);
    next(error);
  } finally {
    client.release();
  }
};

// Eliminar un empleado
const deleteEmpleado = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query("BEGIN");

    // Obtener NoEconomico asociado
    const empleadoRes = await client.query(
      "SELECT noEconomico FROM empleado WHERE id = $1",
      [id]
    );

    if (empleadoRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    const noEconomico = empleadoRes.rows[0].noeconomico;

    // Eliminar permisos asociados
    await client.query("DELETE FROM empleado_permiso WHERE noEconomico = $1", [
      noEconomico,
    ]);

    // Eliminar empleado
    await client.query("DELETE FROM empleado WHERE id = $1", [id]);

    await client.query("COMMIT");
    return res.sendStatus(204);
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};

// Actualizar un empleado
const updateEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      noEconomico,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      correoInstitucional,
      estado,
      tipo,
    } = req.body;

    const query = `
      UPDATE empleado 
      SET noeconomico = $1, nombre = $2, apellidopaterno = $3, 
          apellidomaterno = $4, correoinstitucional = $5, estado = $6, tipo = $7
      WHERE id = $8 
      RETURNING *`;

    const valores = [noEconomico, nombre, apellidoPaterno, apellidoMaterno, correoInstitucional, estado, tipo, id];

    const result = await pool.query(query, valores);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
// Obtener tipos de empleado
const getTiposEmpleado = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM tipo_empleado");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// Obtener estados de empleado
const getEstadosEmpleado = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM estado_empleado");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// Obtener todos los permisos disponibles
const getPermisosEmpleado = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM permisos_empleado");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// Obtener permisos asignados a un empleado
const getEmpleadoPermisos = async (req, res, next) => {
  try {
    const { id } = req.params;
    const empleado = await pool.query(
  "SELECT noeconomico FROM empleado WHERE noeconomico = $1",
  [id]
);

    if (empleado.rows.length === 0)
      return res.status(404).json({ message: "Empleado no encontrado" });

    const noEco = empleado.rows[0].noeconomico;

    const result = await pool.query(
      "SELECT idpermiso FROM empleado_permiso WHERE noeconomico = $1",
      [noEco]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// Actualizar permisos de un empleado
const updateEmpleadoPermisos = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { permisos } = req.body;

    const empleado = await pool.query(
      "SELECT noeconomico FROM empleado WHERE id = $1",
      [id]
    );

    if (empleado.rows.length === 0)
      return res.status(404).json({ message: "Empleado no encontrado" });

    const noEco = empleado.rows[0].noeconomico;

    await pool.query("DELETE FROM empleado_permiso WHERE noeconomico = $1", [
      noEco,
    ]);

    for (let idPermiso of permisos) {
      await pool.query(
        "INSERT INTO empleado_permiso (noeconomico, idpermiso) VALUES ($1, $2)",
        [noEco, idPermiso]
      );
    }

    res.status(200).json({ message: "Permisos actualizados correctamente" });
  } catch (error) {
    next(error);
  }
};

// busqueda por id_keycloak
const getEmpleadoByUUID = async (req, res, next) => {
  try {
    const { uuid } = req.params;

    const result = await pool.query(
      `SELECT e.*, ee.nombre AS estado_nombre, te.nombre AS tipo_nombre 
       FROM empleado e 
       JOIN estado_empleado ee ON e.estado = ee.id 
       JOIN tipo_empleado te ON e.tipo = te.id 
       WHERE e.id_keycloak::text = $1`,
      [uuid]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No vinculado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEmpleados,
  getEmpleado,
  createEmpleado,
  deleteEmpleado,
  updateEmpleado,
  getTiposEmpleado,
  getEstadosEmpleado,
  getPermisosEmpleado,
  getEmpleadoPermisos,
  updateEmpleadoPermisos,
  getEmpleadoByUUID,
};
