const {Router} = require('express');
const {
    getAllMateriales,
    getMaterial,
    createMaterial,
    deleteMaterial,
    updateMaterial
} = require ('../controllers/material.controllers')

const router = Router();

router.get('/', getAllMateriales); 
router.get('/:id', getMaterial);
router.post('/', createMaterial);
router.delete('/:id', deleteMaterial);
router.put('/:id', updateMaterial);

module.exports = router;