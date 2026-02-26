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

router.get('/materiales', getAllMateriales);
router.get('/material/:id', getMaterial);
router.post('/material', createMaterial);
router.delete('/material/:id', deleteMaterial);
router.put('/material/:id', updateMaterial);
router.get('/material/:id/historial', getHistorialMaterial);
router.get('/material/incidencias', getMaterialesIncidencias);
router.put('/material/:id/gestionar', putHistorialYEstadoMaterial);

module.exports = router;