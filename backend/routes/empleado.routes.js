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
  getTecnicos,
} = require("../controllers/empleado.controllers");

const router = Router();

router.get("/empleados", getAllEmpleados);
router.get("/empleado/:id", getEmpleado);
router.post("/empleado", createEmpleado);
router.delete("/empleado/:id", deleteEmpleado);
router.put("/empleado/:id", updateEmpleado);
router.get("/tipos-empleado", getTiposEmpleado);
router.get("/estados-empleado", getEstadosEmpleado);
router.get("/permisos-empleado", getPermisosEmpleado);
router.get("/empleado/:id/permisos", getEmpleadoPermisos);
router.post("/empleado/:id/permisos", updateEmpleadoPermisos);
router.get("/tecnicos", getTecnicos);

module.exports = router;