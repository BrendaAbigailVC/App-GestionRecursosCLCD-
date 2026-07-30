const { Router } = require("express");
const { loginSync } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware"); //middleware de Keycloak

const router = Router();

//Esta ruta la llamará el frontend justo después de que Keycloak le de el token
router.get("/login-check", loginSync);

module.exports = router;