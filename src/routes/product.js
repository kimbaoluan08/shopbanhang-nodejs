const express = require('express');
const router = express.Router();
const productController = require('../app/controllers/ProductController');
const upload = require('../app/middleware/upload');
const { authJwt } = require("../app/middleware/auth-admin");

//productController.index
router.get('/add', Auth ,CheckRole_1, productController.add);
router.post('/store', Auth ,CheckRole_1, upload.single('anhchinh'), productController.store); //upload.array('anhchinh', 3)
router.post('/store-img/:id', Auth ,CheckRole_1, upload.array('hinhanh', 3), productController.store_img); //upload.array('anhchinh', 3)

router.get('/list', productController.list);
router.get('/detail-product/:id', productController.detail_product);

router.get('/edit-product/:id', Auth ,CheckRole_1, productController.edit_product);
router.put('/update-product/:id', Auth ,CheckRole_1, upload.single('anhchinh'), productController.update_product);

router.get('/add-detail-laptop/:id', Auth ,CheckRole_1, productController.add_laptop);
router.post('/store-detail-laptop/:id', Auth ,CheckRole_1, productController.store_laptop);

router.get('/add-detail-dt/:id', Auth ,CheckRole_1, productController.add_dt);
router.post('/store-detail-dt/:id', Auth ,CheckRole_1, productController.store_dt);

router.delete('/:id', Auth , CheckRole, productController.delete);

module.exports = router;