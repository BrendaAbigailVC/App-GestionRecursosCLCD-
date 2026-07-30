const { Router } = require('express');
const {
    getAllAlumnos,
    getAlumno,
    createAlumno,
    deleteAlumno,
    updateAlumno,
    getPerfil,
} = require('../controllers/alumno.controllers')

const router = Router();

// El prefijo '/api/alumnos' ya viene del index.js
router.get('/', getAllAlumnos);          // GET /api/alumnos
router.get('/:id', getAlumno);           // GET /api/alumnos/:id
router.post('/', createAlumno);          // POST /api/alumnos  <-- ESTA ES LA RUTA
router.delete('/:id', deleteAlumno);     // DELETE /api/alumnos/:id
router.put('/:id', updateAlumno);        // PUT /api/alumnos/:id
router.get('/perfil/:id', getPerfil);    // GET /api/alumnos/perfil/:id

module.exports = router;