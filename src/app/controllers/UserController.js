const User = require('../models/User');
const {
    mongooseToObject
} = require('../../util/mongoose');
const {
    mutipleMongooseToObject
} = require('../../util/mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('./sendMail');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const Product = require('../models/Product');
const Address = require('../models/Address');
const Comment = require('../models/Comment');

class UserController {
    //get
    index(req, res, next) {
        if (req.session.user) {
            res.redirect('/');
        } else {
            res.render('user/register', {
                title: 'Đăng kí',
                layout: 'main-user.hbs'
            });
        }
    }
    //post
    async register(req, res) {
        // console.log(req.body);
        const plainTextPassword = await bcrypt.hash(req.body.matkhau, 10);

        const user = new User({
            hoten: req.body.hoten,
            tendn: req.body.tendn,
            matkhau: plainTextPassword,
            gioitinh: req.body.gioitinh,
            sdt: req.body.sdt,
            email: req.body.email
        })

        // const activation_token = jwt.sign({ _id: user.id },"" + process.env.ACTIVATION_TOKEN_SECRECT);

        // const url = `${CLIENT_URL}/user/active/${activation_token}`;
        // sendMail(req.body.email, url);

        try {
            var saveUser = await user.save(function (err, result) {
                const address = new Address({
                    idnguoidung: result.idnguoidung,
                    diachi: req.body.diachi
                })
                address.save();
            });
            res.redirect('/user/login');
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
    //login
    login(req, res) {
        if(req.session.user) {
            res.redirect('/');
        } else {
            res.render('user/login', {
                title: 'Đăng nhập',
                layout: 'main-user.hbs'
            });
        }
    }
    //check
    async checklogin(req, res) {
        try {
            const user = await User.findOne({
                tendn: req.body.tendn
            });
            const checkpasss = await bcrypt.compare(req.body.matkhau, user.matkhau);
            if (!user && checkpasss) {

            } else if (!checkpasss && user) {
                return res.status(400).send('Mat khau khong hop le');
            } else {
                const token = jwt.sign({
                    _id: user.idnguoidung
                }, "" + process.env.TOKEN_KEY, {
                    expiresIn: 3 * 24 * 60 * 60
                });

                req.session.user = token;

                if (req.session.cart && req.session.cart.totalQty > 0) {
                    res.redirect('/user/thanh-toan');
                } else {
                    res.redirect('/');
                }
            }

        } catch (err) {
            return res.status(500).json({
                msg: 'error'
            })
        }

    }
    //checkout
    async thanhtoan(req, res, next) {
        const token = req.session.user;
        const user = jwt.verify(token, "" + process.env.TOKEN_KEY);
        await User.findOne({
            idnguoidung: user._id
        }, async function (err, result) {
            var cart = new Cart(req.session.cart);

            var sum = 0;

            var cart_1 = cart.generateArray();

            cart_1.forEach(total => {
                sum = sum + total.price;
            });

            var address = await Address.find({
                idnguoidung: user._id
            }).exec();
            if (req.session.coupon) {
                var total = sum - req.session.coupon.mucgiam;
            } else {
                var total = sum;
            }
            res.render('user/checkout', {
                title: 'Thanh toán',
                user: mongooseToObject(result),
                address: mutipleMongooseToObject(address),
                totalPrice: total,
                products: cart.generateArray(),
                layout: 'main-user.hbs'
            })
        });
    }
    //them dia chi
    async save_address(req, res, next) {
        const token = req.session.user;
        const user = jwt.verify(token, "" + process.env.TOKEN_KEY);
        const address = new Address({
            idnguoidung: user._id,
            diachi: req.body.diachimoi
        });
        await address.save();

        res.redirect('/user/thanh-toan');
    }
    //
    async save_checkout(req, res, next) {
        const token = req.session.user;
        const user = jwt.verify(token, "" + process.env.TOKEN_KEY);
        var cart = new Cart(req.session.cart);
        var sum = 0;

        var cart_1 = cart.generateArray();

        cart_1.forEach(total => {
            sum = sum + total.price;
        });

        if (req.session.coupon) {
            var total = sum - req.session.coupon.mucgiam;
        } else {
            var total = sum;
        }
        const order = new Order({
            idkh: user._id,
            tenkh: req.body.hoten,
            madc: req.body.diachi,
            sdt: req.body.sdt,
            email: req.body.email,
            ghichu: req.body.ghichu,
            tongtien: total,
            hinhthuctt: req.body.hinhthuctt,
        });
        order.save(function (err, result) {
            var arr = cart.generateArray();
            arr.forEach(async (cart) => {
                const orderdetail = new OrderDetail({
                    id: result.madh,
                    idsp: cart.item.masp,
                    tensp: cart.item.tensp,
                    hinhanh: cart.item.hinhanh,
                    soluong: cart.qty,
                    giatien: cart.price
                });
                orderdetail.save();
                const product = await Product.findOne({
                    masp: cart.item.masp
                });
                Product.findOneAndUpdate({
                    masp: cart.item.masp
                }, {
                    soluong: product.soluong - cart.qty
                }, (err, data) => {});
            });
        });

        //delete cart 
        if (req.session.coupon) {
            delete req.session.coupon;
        }
        delete req.session.cart;

        res.redirect('/user/success')
    }
    //
    success(req, res, next){
        res.render('user/success', {
            title: 'Thành công',
            layout: 'main-user.hbs'
        })
    }
    //order
    async order(req, res, next) {
        const token = req.session.user;
        const user = jwt.verify(token, "" + process.env.TOKEN_KEY);
        await Order.find({
            idkh: user._id
        }).sort({ tinhtrang: 1 }).exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: 'Erorr en STATUS1'
                })
            }
            res.render('user/order', {
                title: 'Đơn hàng của tôi',
                token: token,
                order: mutipleMongooseToObject(result),
                layout: 'main-user.hbs'
            });
        })
    }
    //Xem don hang
    async xemdonhang(req, res, next){
        var id = parseInt(req.params.id);
        Order.aggregate([{
            $lookup: {
                from: "orderdetails",
                localField: "madh",
                foreignField: "id",
                as: "orders"
            }
        }, {
            $match: {
                madh: id
            }
        }
        ]).exec(function (err, result) {
            //res.json(result);
            res.render('user/view-order', {
                title: 'Chi tiết đơn hàng',
                order: result,
                layout: 'main-user.hbs'
            })
        })
    }
    
    //Huy don hang
    async huydonhang(req, res, next) {
        const id = req.params.id;
        await Order.findOneAndUpdate({
            madh: id
        }, {
            tinhtrang: '5'
        }, (err, data) => {
            OrderDetail.find({ id: id }).exec((err, result) => {
                var arr = result;
                arr.forEach(async (product) => {
                    var masp = product.idsp;
                    var pro = await Product.findOne({ masp: masp }).exec();

                    var qty = pro.soluong + product.soluong;

                    await Product.findOneAndUpdate({ masp: masp }, { soluong: qty }).exec();
                })
            })
            
            res.redirect('back');
        });

    }
    //Comment
    async save_comment(req, res, next){
        var id = req.params.id;
        var token = req.session.user;
        var user = jwt.verify(token, "" + process.env.TOKEN_KEY);
        var result = await User.findOne({idnguoidung: user._id}).exec();
        
        var comment = new Comment({
            idnguoidung: result.idnguoidung,
            masp: id,
            tenkh: result.hoten,
            noidung: req.body.noidung,
            danhgia: req.body.rating
        });

        comment.save();
        res.redirect('back');

    }
    //info
    async info(req, res, next){
        var token = req.session.user;
        var user = jwt.verify(token, "" + process.env.TOKEN_KEY);
        var result = await User.findOne({idnguoidung: user._id}).exec();

    
        res.render('user/info', {
            user: mongooseToObject(result),
            title: 'Thông tin cá nhân',
            layout: 'main-user.hbs'
        })
    }

    //logout
    async logout(req, res) {
        await delete req.session.user;
        res.redirect('/');
    }
}
module.exports = new UserController;

const userController = require('./UserController');