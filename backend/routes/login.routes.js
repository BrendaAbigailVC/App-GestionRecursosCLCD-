const { Router } = require("express");
const { loginSync } = require("../controllers/auth.controllers"); // Importamos el controlador que arreglamos
const verifyToken = require("../middleware/auth");

const router = Router();

// 1. Cambiamos POST por GET (como lo pide tu React)
// 2. Corregimos el nombre a /login-check
// 3. Usamos loginSync (el que maneja matricula y noeconomico)
router.get("/login-check", verifyToken, loginSync);

module.exports = router;