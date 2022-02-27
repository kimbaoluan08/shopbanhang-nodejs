const Admin = require('../models/Admin');
const User = require('../models/User');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Comment = require('../models/Comment');
const Product = require('../models/Product');
const Role = require('../models/Role');
const mongoose = require('mongoose');
const {
    mutipleMongooseToObject,
    mongooseToObject
} = require('../../util/mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PAGE_SIZE = 8;

class AdminController {
    //get
    async login(req, res, next) {
        const token = req.cookies.jwt_admin;
        if (token) {
            res.redirect('/admin/dashboard');
        } else {
            res.render('admin/login', {
                title: 'Đăng nhập',
                layout: 'main-admin-login.hbs'
            });
        }
    }
    async checklogin(req, res, next) {
        //res.json(admin)
        try {
            const admin = await Admin.findOne({
                taikhoan: req.body.taikhoan
            });
            const checkpass = await bcrypt.compare(req.body.matkhau, admin.matkhau);
            if (!admin && checkpass) {
                return res.status(400).send('Ten dang nhap khong ton tai');
            } else if (!checkpass && admin) {
                return res.status(400).send('Mat khau khong hop le');
            } else {
                if (admin.tinhtrang == 1){
                    const token = jwt.sign({
                        _id: admin.id,
                        maquyen: admin.maquyen
                    }, "" + process.env.TOKEN_KEY, {
                        expiresIn: 3 * 24 * 60 * 60
                    });
    
                    res.cookie('jwt_admin', token);
    
                    res.redirect('/admin/dashboard');
                } else {
                    res.redirect('/admin');
                }
                
            }
        } catch (err) {
            // return res.status(500).json({
            //     msg: 'error'
            // })
            res.redirect('/admin');
        }
    }
    //
    async dashboard(req, res, next) {
        //
        var order_1 = await Order.find({ tinhtrang: 1 }).exec();
        var sum_order_1 = order_1.length;
        req.session.order = sum_order_1;


        var comment = await Comment.find({ tinhtrang: 0 }).exec();
        var sum_comment = comment.length;
        req.session.comment = sum_comment;

        //Order cost
        var order = await Order.find({ tinhtrang: 2 }).exec();
        var sum_order = 0;
        order.forEach((or) =>{
            sum_order += or.tongtien;
        })
      
        //user
        var user = await User.find().exec();
        var sum_user = user.length;
       
        //product
        var pro = await Product.find().exec();
        var sum_pro = pro.length;

        //order
        var order_bill = await Order.find().exec();
        var sum_order_bill = order_bill.length;

        res.render('admin/home', {
            title: 'Admin Page',
            layout: 'main-admin.hbs',
            order: sum_order/1000,
            user: sum_user,
            product: sum_pro,
            bill: sum_order_bill
        });
    }
    //
    khachhang(req, res, next) {
        User.aggregate([{
                $lookup: {
                    from: "orders",
                    localField: "idnguoidung",
                    foreignField: "idkh",
                    as: "order"
                }
            }, {
                $addFields: {
                    CountOrder: {
                        $size: "$order"
                    }
                }
            },
            {
                $sort: {
                    createdAt: 1
                }
            }
        ]).exec(function (err, result) {
            //res.json(result);
            res.render('admin/user/customer', {
                title: 'Người dùng',
                customer: result,
                layout: 'main-admin.hbs'
            })
        })
    }
    //Order
    donhang(req, res, next) {
        var page = req.query.page;
        if (page) {
            if (page < 1) {
                page = 1;
            }
            page = parseInt(page);
            var skip = (page - 1) * PAGE_SIZE;

            Order.find({}).sort({
                tinhtrang: 1
            }).skip(skip).limit(PAGE_SIZE).exec((err, data) => {
                res.render('admin/user/order', {
                    title: 'Đơn hàng',
                    order: mutipleMongooseToObject(data),
                    layout: 'main-admin.hbs'
                })
            });

        } else {
            Order.find({}).sort({
                tinhtrang: 1
            }).exec((err, data) => {
                res.render('admin/user/order', {
                    title: 'Đơn hàng',
                    order: mutipleMongooseToObject(data),
                    layout: 'main-admin.hbs'
                })
            });
        }


    }
    //chi tiet don hang
    chitietdh(req, res, next) {
        var id =  parseInt(req.params.id);
        Order.aggregate([{
            $lookup: {
                from: "orderdetails",
                localField: "madh",
                foreignField: "id",
                as: "orderdetail"
            }
        }, {
            $lookup: {
                from: "addresses",
                localField: "madc",
                foreignField: "madc",
                as: "address"
            }
        },{
            $match: {
                madh: id
            }
        }]).exec(function (err, result) {
            res.render('admin/user/detail-order', {
                title: 'Chi tiết đơn hàng',
                order: result,
                layout: 'main-admin.hbs'
            })
        })
    }
    //Xac nhan
    async xacnhandh(req, res, next) {
        const id = req.params.id;
        await Order.findOneAndUpdate({
            madh: id
        }, {
            tinhtrang: '2'
        }, (err, data) => {
            req.session.message = {
                success: 'Thành công'
            };
            res.redirect('back');
        });

    }
    //Nhan vien
    nhanvien(req, res, next) {
        Admin.find().exec((err, result) => {
            res.render('admin/user', {
                title: 'Quản lý nhân viên',
                user: mutipleMongooseToObject(result),
                layout: 'main-admin.hbs'
            })
        })
    }
    //them nhan vien
    them_nv(req, res, next) {
        res.render('admin/add-user', {
            title: 'Thêm nhân viên',
            layout: 'main-admin.hbs'
        });
    }
    //luu nhan vien
    async luu_nv(req, res) {
        const plainTextPassword = await bcrypt.hash(req.body.matkhau, 10);

        const admin = new Admin({
            hoten: req.body.hoten,
            taikhoan: req.body.taikhoan,
            matkhau: plainTextPassword,
            maquyen: req.body.maquyen
        })
        try {
            const saveAdmin = await admin.save();
            req.session.message = {
                add: 'Thành công'
            };
            res.redirect('/admin/user');
        } catch (error) {
            if (error.code == 11000) {
                //trung khoa
                return res.json({
                    status: 'error',
                    error: 'Tài khoản đã tồn tại'
                });
            }
            throw error
        }
    }
    //sua nhan vien
    async edit_nv(req, res, next) {
        var id = req.params.id;
        await Admin.findOne({
            _id: id
        }).exec((err, result) => {
            Role.find().exec((err, result_1) => {
                res.render('admin/edit-user', {
                    title: 'Sửa thông tin nhân viên',
                    user: mongooseToObject(result),
                    role: mutipleMongooseToObject(result_1),
                    layout: 'main-admin.hbs'
                })
            })
        })
    }
    //cat nhat nhan vien
    async capnhat_nv(req, res, next) {
        var id = req.params.id;
        await Admin.findOneAndUpdate({
            _id: id
        }, {
            hoten: req.body.hoten,
            maquyen: req.body.maquyen,
            tinhtrang: req.body.tinhtrang
        }, (err, data) => {
            req.session.message = {
                success: 'Thành công'
            };
            res.redirect('/admin/user');
        });
    }
    //xoa nhan vien
    async del_nv(req, res, next) {
        var id = req.params.id;
        await Admin.deleteOne({
            _id: id
        }).exec();
        req.session.message = {
            delete: 'Thành công'
        };
        res.redirect('back');
    }
    //--------------------------
    list_comment(req, res, next){
        Comment.aggregate([{
            $lookup: {
                from: "products",
                localField: "masp",
                foreignField: "masp",
                as: "product"
            }
        },{
            $sort: {
                tingtrang: -1
            }
        }]).exec(function (err, result) {
            res.render('admin/comment', {
                title: 'Bình luận sản phẩm',
                comment: result,
                layout: 'main-admin.hbs'
            })
        })
    }
    //active comment
    async active_comment(req, res, next){
        const id  = req.params.id;
        await Comment.findOneAndUpdate({
            mabl: id
        }, {
            tinhtrang: 1
        }, (err, data) => {
            req.session.message = {
                success: 'Thành công'
            };
            res.redirect('/admin/comment');
        });
    }
    async un_active_comment(req, res, next){
        const id  = req.params.id;
        await Comment.findOneAndUpdate({
            mabl: id
        }, {
            tinhtrang: 0
        }, (err, data) => {
            req.session.message = {
                success_1: 'Thành công'
            };
            res.redirect('/admin/comment');
        });
    }

    async delete_comment(req, res, next) {
        await Comment.deleteOne({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // -------------------------
    //coupon
    add_coupon(req, res, next) {
        res.render('admin/coupon/add-coupon', {
            title: 'Thêm mã giảm giá',
            layout: 'main-admin.hbs'
        })
    }

    async store_coupon(req, res, next) {
        var coupon = new Coupon(req.body);
        var magg = await coupon.save();

        res.redirect('/admin/list-coupon');
    }

    async edit_coupon(req, res, next) {
        var id = req.params.id;
        await Coupon.findOne({
            _id: id
        }).exec((err, result) => {
            res.render('admin/coupon/edit-coupon', {
                title: 'Sửa mã giảm giá',
                coupon: mongooseToObject(result),
                layout: 'main-admin.hbs'
            })
        })
    }

    list_coupon(req, res, next) {
        Coupon.find().exec((err, result) => {
            res.render('admin/coupon/list-coupon', {
                title: 'Danh sách mã giảm giá',
                coupon: mutipleMongooseToObject(result),
                layout: 'main-admin.hbs'
            })
        })
    }

    //PUT update
    async update_coupon(req, res, next) {
        await Coupon.updateOne({
                _id: req.params.id
            }, req.body)
            .then(() => res.redirect('/admin/list-coupon'))
            .catch(next);
    }

    //Delete
    async delete_coupon(req, res, next) {
        await Coupon.deleteOne({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //dang xuat
    logout(req, res) {
        res.cookie('jwt_admin', '', {
            maxAge: 0
        });
        res.redirect('/admin');
    }
}
module.exports = new AdminController;