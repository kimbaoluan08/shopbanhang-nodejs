const express = require('express');
const router = express.Router();

const homeController = require('../app/controllers/HomeController');
const { authJwt } = require("../app/middleware/auth-user");

//latop
router.get('/lap-top', homeController.laptop);
router.get('/lap-top/:slug', homeController.chitietlaptop);

//dien thoai
router.get('/dien-thoai', homeController.dienthoai);
router.get('/dien-thoai/:slug', homeController.chitietdt);

//
router.get('/phu-kien', homeController.phukien);
router.get('/phu-kien/:slug', homeController.chitietpk);

//search
router.post('/getProducts', homeController.searchProducts);

//coupon
router.post('/check-coupon', homeController.check_coupon);
router.get('/del-coupon', homeController.del_coupon);

//cart
router.get('/gio-hang/', homeController.view_cart);
router.post('/them-gio-hang/:id', homeController.add_cart);
router.post('/update/:id', homeController.update_cart);
router.get('/remove/:id', homeController.remove);
router.get('/', homeController.index);

//page
router.get('/contact', homeController.contact);

module.exports = router;