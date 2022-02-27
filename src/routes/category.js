const express = require('express');
const router = express.Router();

const { authJwt } = require("../app/middleware/auth-admin");
const categoryController = require('../app/controllers/CategoryController');

router.get('/add', Auth, CheckRole, categoryController.create);
router.post('/store', Auth, CheckRole, categoryController.store);
router.get('/:id/edit', Auth, CheckRole, categoryController.edit);
router.put('/:id', Auth, CheckRole, categoryController.update);
router.delete('/:id', Auth, CheckRole, categoryController.delete);
router.get('/list', Auth, CheckRole, categoryController.list);

module.exports = router;