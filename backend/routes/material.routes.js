const {Router} = require('express');
const {
    getAllMateriales,
    getMaterial,
    createMaterial,
    deleteMaterial,
    updateMaterial,
    getHistorialMaterial,
    getMaterialesIncidencias,
    putHistorialYEstadoMaterial
} = require ('../controllers/material.controllers')

const router = Router();

router.get('/', getAllMateriales); 
router.get('/incidencias', getMaterialesIncidencias);
router.get('/:id/historial', getHistorialMaterial);
router.put('/:id/gestionar', putHistorialYEstadoMaterial);
router.get('/:id', getMaterial);
router.post('/', createMaterial);
router.delete('/:id', deleteMaterial);
router.put('/:id', updateMaterial);

module.exports = router;