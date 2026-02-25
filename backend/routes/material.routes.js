const {Router} = require('express');
const {
    getAllMateriales,
    getMaterial,
    createMaterial,
    deleteMaterial,
    updateMaterial,
    getHistorialMaterial
} = require ('../controllers/material.controllers')

const router = Router();

router.get('/materiales', getAllMateriales);
router.get('/material/:id', getMaterial);
router.post('/material', createMaterial);
router.delete('/material/:id', deleteMaterial);
router.put('/material/:id', updateMaterial);
router.get('/material/:id/historial', getHistorialMaterial);

module.exports = router;