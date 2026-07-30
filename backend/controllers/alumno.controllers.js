const pool = require("../db");

const getAllAlumnos = async (req, res, next) => {
  try {
    const allAlumnos = await pool.query("SELECT * FROM alumno");
    res.json(allAlumnos.rows);
  } catch (error) {
    next(error);
  }
};

const getAlumno = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM alumno WHERE id = $1", [id]);
    if (result.rows.length == 0)
      return res.status(404).json({
        message: "Alumno no encontrado",
      });

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const createAlumno = async (req, res, next) => {
  console.log("DATOS RECIBIDOS EN EL BACKEND:", req.body); // <-- AGREGA ESTO

  try {
    const {
      matricula,
      //id_keycloak,
      nombre,
      apellidopaterno, // Asegúrate que se llamen así
      apellidomaterno,
      unidad,
      division,
      licenciatura,
      estado,
      correoinstitucional,
      observaciones,
    } = req.body;

    const sancion = 0;

    const result = await pool.query(
      `INSERT INTO alumno (
         id,
         matricula,
         id_keycloak, 
         nombre, 
         apellidopaterno, 
         apellidomaterno, 
         unidad, division, 
         licenciatura, 
         estado, 
         sancion, 
         correoinstitucional, 
         observaciones) 
       VALUES ($1, $1, NULL, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        matricula, 
        nombre, 
        apellidopaterno, 
        apellidomaterno, 
        unidad, division, 
        licenciatura, 
        estado, 
        sancion, 
        correoinstitucional, 
        observaciones
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("ERROR REAL DE POSTGRES:", error.message); // <-- AGREGA ESTO
    next(error);
  }
};

const deleteAlumno = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM alumno WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({
        message: "Alumno not found",
      });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const updateAlumno = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      matricula,
      nombre,
      apellidop,
      apellidom,
      unidad,
      division,
      licenciatura,
      estado,
      correoinstitucional,
      observaciones,
    } = req.body;

    const query = `
        UPDATE alumno 
        SET matricula = $1, nombre = $2, apellidopaterno = $3, 
            apellidomaterno = $4, unidad = $5, division = $6, licenciatura = $7, 
            estado = $8, correoinstitucional = $9, observaciones = $10
        WHERE id = $11 
        RETURNING *`;
    
    const values = [matricula, nombre, apellidop, apellidom, unidad, division, licenciatura, estado, correoinstitucional, observaciones, id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};


const getPerfil = async (req, res, next) => { 
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        a.id,
        a.matricula,
        a.id_keycloak,
        a.nombre,
        a.apellidopaterno,
        a.apellidomaterno,
        a.correoinstitucional,
        u.nombre AS unidad,
        d.nombre AS division,
        l.nombre AS licenciatura,
        CASE a.estado
          WHEN 1 THEN 'Inscrito'
          WHEN 2 THEN 'No inscrito'
          ELSE 'Desconocido'
        END AS estado,
        CASE a.sancion
          WHEN '0' THEN 'Sin sanción'
          WHEN '1' THEN 'Sancionado'
          ELSE 'Desconocido'
        END AS sancion,
        a.observaciones
      FROM alumno a
      LEFT JOIN unidad u ON a.unidad = u.id
      LEFT JOIN division d ON a.division = d.id
      LEFT JOIN licenciatura l ON a.licenciatura = l.id
      WHERE a.id = $1
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length == 0)
      return res.status(404).json({
        message: "Alumno no encontrado",
      });

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAlumnos,
  getAlumno,
  createAlumno,
  deleteAlumno,
  updateAlumno,
  getPerfil,
};
