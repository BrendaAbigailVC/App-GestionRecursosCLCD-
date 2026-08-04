const { Router } = require("express");
const {
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
  getTecnicos
} = require("../controllers/empleado.controllers");

// ... imports

const router = Router();

// 1. Catálogos
router.get("/tipos-empleado", getTiposEmpleado);
router.get("/estados-empleado", getEstadosEmpleado);
router.get("/permisos-empleado", getPermisosEmpleado);

// 2. Perfil (Mantenlo con /perfil/)
router.get("/perfil/:uuid", getEmpleadoByUUID);

// 3. Específicos por ID (Quitamos la palabra /empleado/ de la subruta)
router.get("/:id", getEmpleado); 
router.get("/:id/permisos", getEmpleadoPermisos);
router.post("/:id/permisos", updateEmpleadoPermisos);
router.delete("/:id", deleteEmpleado);
router.put("/:id", updateEmpleado);

// 4. Listado y creación
router.get("/", getAllEmpleados);
router.post("/", createEmpleado);

// 5. Técnicos
router.get("/tecnicos", getTecnicos);

module.exports = router;