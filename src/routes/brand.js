const express = require('express');
const router = express.Router();


const { authJwt } = require("../app/middleware/auth-admin");
const brandController = require('../app/controllers/BrandController');

router.get('/add', Auth, CheckRole, brandController.create);
router.post('/store',Auth, CheckRole, brandController.store);
router.get('/:id/edit', Auth, CheckRole, brandController.edit);
router.put('/:id', Auth, CheckRole, brandController.update);
router.delete('/:id', Auth, CheckRole, brandController.delete);
router.get('/list', Auth, CheckRole, brandController.list);

module.exports = router;