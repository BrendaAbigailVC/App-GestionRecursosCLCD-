const { Router } = require("express");
const { loginUsuario } = require("../controllers/login.controllers");
const verifyToken = require("../middleware/auth");

const router = Router();
//Esta ruta la llamará el frontend justo después de que Keycloak le de el token
router.get(
  "/login-check",
  verifyToken,
  loginUsuario
);

module.exports = router;
