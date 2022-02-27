const express = require('express');
const router = express.Router();

const { authJwt } = require("../app/middleware/auth-user");
const userController = require('../app/controllers/UserController');

//login
router.get('/form', userController.index);
router.post('/checklogin', userController.checklogin);
router.get('/login', userController.login);
router.post('/register', userController.register);

//checkout
router.get('/thanh-toan', requireAuth, userController.thanhtoan);
router.post('/them-dia-chi', requireAuth, userController.save_address);
router.post('/luu-thanh-toan', requireAuth, userController.save_checkout);
router.get('/xem-don-hang/:id', requireAuth, userController.xemdonhang);
router.get('/huy-don-hang/:id', requireAuth, userController.huydonhang);
router.get('/don-hang', requireAuth, userController.order);

//info
router.get('/info', requireAuth, userController.info);
router.get('/success', requireAuth, userController.success);

//commet
router.post('/gui-binh-luan/:id', requireAuth, userController.save_comment);

router.get('/logout', requireAuth, userController.logout);

module.exports = router;