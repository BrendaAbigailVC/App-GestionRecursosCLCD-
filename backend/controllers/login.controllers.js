const pool = require("../db");

const loginUsuario = async (req, res, next) => {
  try {
    // Datos provenientes del JWT de Keycloak
    const { email, sub } = req.user;

    // Realm Roles de Keycloak
    const roles = req.user.realm_access?.roles || [];

    console.log("Usuario Keycloak:", req.user);
    console.log("Roles Keycloak:", roles);

    if (!email) {
      return res.status(400).json({
        message: "El token no contiene un correo válido"
      });
    }

    /* 1. BUSCAR EN EMPLEADOS */

    const empleado = await pool.query(
      "SELECT * FROM empleado WHERE correoinstitucional = $1",
      [email]
    );

    if (empleado.rows.length > 0) {

      let user = empleado.rows[0];

      // Guardar ID de Keycloak si todavía no existe
      if (!user.id_keycloak) {
        await pool.query(
          `
          UPDATE empleado
          SET id_keycloak = $1
          WHERE correoinstitucional = $2
          `,
          [sub, email]
        );

        user.id_keycloak = user.id_keycloak || sub;
      }


      /*SINCRONIZAR ROL KEYCLOAK -> BD*/

      const prioridadRoles = [
        "COORDINADOR",
        "TECNICO",
        "PROFESOR"
      ];

      const rolEmpleado = prioridadRoles.find(
        rol => roles.includes(rol)
      );


      if (rolEmpleado) {

        await pool.query(
          `
          UPDATE empleado
          SET tipo = (
              SELECT id
              FROM tipo_empleado
              WHERE nombre = $1
          )
          WHERE correoinstitucional = $2
          `,
          [rolEmpleado, email]
        );

        console.log(
          `[Sync Rol] ${email} actualizado como ${rolEmpleado}`
        );
      }


      return res.json({
        tipo: "empleado",
        datos: {
          ...user,
          id_keycloak: sub,
          roles: roles
        }
      });
    }


    /*2. BUSCAR EN ALUMNOS*/

    const alumno = await pool.query(
      "SELECT * FROM alumno WHERE correoinstitucional = $1",
      [email]
    );


    if (alumno.rows.length > 0) {

      let user = alumno.rows[0];
      // Guardar ID de Keycloak si todavía no existe
      if (!user.id_keycloak) {
        await pool.query(
          `
          UPDATE alumno
          SET id_keycloak = $1
          WHERE correoinstitucional = $2
          `,
          [sub, email]
        );
        user.id_keycloak = user.id_keycloak || sub;
      }
      return res.json({
        tipo: "alumno",
        datos: {
          ...user,
          id_keycloak: sub,
          roles: roles
        }
      });

    }

    /*3. USUARIO NO REGISTRADO*/

    return res.status(404).json({
      message:
        "Usuario autenticado en Keycloak, pero no registrado en el sistema de la CLCD."
    });


  } catch (error) {

    console.error(
      "Error en login federado:",
      error
    );

    next(error);
  }
};

module.exports = {
  loginUsuario
};