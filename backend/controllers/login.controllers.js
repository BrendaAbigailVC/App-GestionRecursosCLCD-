const pool = require("../db");

const loginUsuario = async (req, res, next) => {
  try {
    //1. Recibimos los datos ya validados por el middleware de Keycloak
    //req.user viene del token decodificado (contiene email y sub/id_keycloak)
    const { email, sub } = req.user; 

    if (!email) {
      return res.status(400).json({ message: "El token no contiene un correo válido" });
    }

    //2. BUSCAR EN EMPLEADOS
    const empleado = await pool.query(
      "SELECT * FROM empleado WHERE correoinstitucional = $1",
      [email]
    );

    if (empleado.rows.length > 0) {
      const user = empleado.rows[0];
      
      //Sincronización: Si no tiene el ID de Keycloak, lo guardamos
      if (!user.id_keycloak) {
        await pool.query(
          "UPDATE empleado SET id_keycloak = $1 WHERE correoinstitucional = $2",
          [sub, email]
        );
      }
      return res.json({ tipo: "empleado", datos: { ...user, id_keycloak: sub } });
    }

    //3. BUSCAR EN ALUMNOS
    const alumno = await pool.query(
      "SELECT * FROM alumno WHERE correoinstitucional = $1",
      [email]
    );

    if (alumno.rows.length > 0) {
      const user = alumno.rows[0];

      //Sincronización: Si no tiene el ID de Keycloak, lo guardamos
      if (!user.id_keycloak) {
        await pool.query(
          "UPDATE alumno SET id_keycloak = $1 WHERE correoinstitucional = $2",
          [sub, email]
        );
      }
      return res.json({ tipo: "alumno", datos: { ...user, id_keycloak: sub } });
    }

    //4. SI NO EXISTE EN NINGUNA TABLA
    return res.status(404).json({ 
      message: "Usuario autenticado en UAM, pero no registrado en el sistema de la CLCD." 
    });

  } catch (error) {
    console.error("Error en el login federado:", error);
    next(error);
  }
};

module.exports = { loginUsuario };