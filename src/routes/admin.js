const express = require('express');
const router = express.Router();

const { authJwt } = require("../app/middleware/auth-admin");
const adminController = require('../app/controllers/AdminController');
const Coupon = require('../app/models/Coupon');

router.get('/', adminController.login);
router.post('/checklogin', adminController.checklogin);

//All
router.get('/dashboard', Auth, adminController.dashboard);

//Admin
router.get('/customer', Auth, CheckRole, adminController.khachhang);
router.get('/user', Auth, CheckRole, adminController.nhanvien);
router.get('/add-user', Auth, CheckRole, adminController.them_nv);
router.post('/store-user', Auth, CheckRole, adminController.luu_nv);
router.get('/:id/edit-user', Auth, CheckRole, adminController.edit_nv);
router.post('/update-user/:id', Auth, CheckRole, adminController.capnhat_nv);
router.delete('/del-user/:id', Auth, CheckRole, adminController.del_nv);

//Order
router.get('/order', Auth, CheckRole_2, adminController.donhang);
router.get('/order/:id', Auth, CheckRole_2, adminController.xacnhandh);
router.get('/view-order/:id', Auth, CheckRole_2, adminController.chitietdh);

//Comment
router.get('/comment', Auth, CheckRole_2, adminController.list_comment);
router.get('/comment/active/:id', Auth, CheckRole_2, adminController.active_comment);
router.get('/comment/un-active/:id', Auth, CheckRole_2, adminController.un_active_comment);
router.delete('/del-commnet/:id', Auth, CheckRole_2, adminController.delete_comment);

//Coupon
router.get('/add-coupon', Auth, CheckRole, adminController.add_coupon);
router.post('/store-coupon', Auth, CheckRole, adminController.store_coupon);
router.get('/list-coupon', Auth, CheckRole, adminController.list_coupon);
router.get('/edit-coupon/:id', Auth, CheckRole, adminController.edit_coupon);
router.put('/update-coupon/:id', Auth, CheckRole, adminController.update_coupon);
router.delete('/del-coupon/:id', Auth, CheckRole, adminController.delete_coupon);

//All
router.get('/logout', Auth, adminController.logout);

module.exports = router;