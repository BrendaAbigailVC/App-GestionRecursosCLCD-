const pool = require("../db");

const loginSync = async (req, res, next) => {
  try {

    //console.log("Datos recibidos en req.user:", req.user);

    // Extraemos id_keycloak (sub), matricula y noeconomico del token
    const { sub: id_keycloak, matricula, noeconomico } = req.user; 

    // CASO 1: Es un Alumno
    if (matricula) {
      const queryAlumno = `
        UPDATE alumno 
        SET id_keycloak = $1 
        WHERE matricula = $2 AND id_keycloak IS NULL
        RETURNING *`;
      const result = await pool.query(queryAlumno, [id_keycloak, matricula]);
      
      if (result.rowCount > 0) {
        console.log(`[Sync] ID de Keycloak vinculado al alumno con matrícula ${matricula}`);
      } else {
        console.log(`[Sync Warning] No se encontró alumno sin vincular con matrícula ${matricula}`)
      }
    } 
    
    // CASO 2: Es un Empleado (Coordinador o Técnico)
    else if (noeconomico) {
      const queryEmpleado = `
        UPDATE empleado 
        SET id_keycloak = $1 
        WHERE noeconomico = $2 AND id_keycloak IS NULL
        RETURNING *`;
      const result = await pool.query(queryEmpleado, [id_keycloak, noeconomico]);

      if (result.rowCount > 0) {
        console.log(`[Sync] ID de Keycloak vinculado al empleado con No. Económico ${noeconomico}`);
      }
    }

    // Respondemos al Frontend
    res.json({ 
      message: "Sesión sincronizada correctamente", 
      user: req.user 
    });

  } catch (error) {
    console.error("[Sync Error]:", error.message);
    next(error);
  }
};

module.exports = { loginSync };