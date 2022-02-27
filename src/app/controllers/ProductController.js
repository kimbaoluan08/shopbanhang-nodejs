const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Image = require('../models/Image');
const Laptop = require('../models/Laptop');
const Smartphone = require('../models/smartphone');
const path = require('path');

const {
    mongooseToObject
} = require('../../util/mongoose');
const {
    mutipleMongooseToObject
} = require('../../util/mongoose');

class ProductController {
    //get
    async add(req, res, next) {
        await Brand.find().sort({
                maloai: 1
            })
            .exec(async function (err, brand) {
                await Category.find({})
                    .then(cate => {
                        res.render('admin/product/create-product', {
                            brand: mutipleMongooseToObject(brand),
                            cate: mutipleMongooseToObject(cate),
                            title: "Thêm sản phẩm",
                            layout: "main-admin.hbs"
                        });
                    })
                    .catch(next);

            });
    }
    //post
    async store(req, res, next) {
        const img = req.file.path.split('\\').slice(1).join('/');
        const str = img.substring(6);
        const product = new Product({
            tensp: req.body.tensp,
            hinhanh: str,
            giagoc: req.body.giagoc,
            giaban: req.body.giaban,
            soluong: req.body.soluong,
            mota: req.body.mota,
            maloai: req.body.maloai,
            math: req.body.math,
        });
        await product.save();

        req.session.message = {
            success: 'Thành công!'
        };
        res.redirect('/admin/product/list');

    }

    //list
    list(req, res, next) {
        Product.find({}).sort({
                maloai: 1
            })
            .then(product => {
                res.render('admin/product/list-product', {
                    product: mutipleMongooseToObject(product),
                    title: "Danh sách sản phẩm",
                    layout: 'main-admin.hbs'
                });
            })
            .catch(next);
    }
    //chi tiet sp
    async detail_product(req, res, next) {

        var id = req.params.id;
        await Product.findOne({
            masp: id
        }).exec((err, result) => {
            Image.find({
                masp: id
            }).exec(async (err, result_1) => {
                var cate = await Category.find().exec();
                var brand = await Brand.find().exec();
                var laptop = await Laptop.findOne({ masp: id }).exec();
                var dt = await Smartphone.findOne({ masp: id }).exec();
                res.render('admin/product/detail-product', {
                    title: 'Chi tiết sản phẩm',
                    product: mongooseToObject(result),
                    laptop: mongooseToObject(laptop),
                    phone: mongooseToObject(dt),
                    image: mutipleMongooseToObject(result_1),
                    cate: mutipleMongooseToObject(cate),
                    brand: mutipleMongooseToObject(brand),
                    layout: 'main-admin.hbs'
                });
            })
        })

    }
    //edit
    async edit_product(req, res, next) {
        var id = req.params.id;
        await Product.findOne({
            _id: id
        }).exec(async (err, result) => {
            var cate = await Category.find().exec();
            var brand = await Brand.find().exec();
            res.render('admin/product/edit-product', {
                title: 'Chỉnh sửa sản phẩm',
                product: mongooseToObject(result),
                cate: mutipleMongooseToObject(cate),
                brand: mutipleMongooseToObject(brand),
                layout: 'main-admin.hbs'
            });
        })
    }
    //update
    async update_product(req, res, next) {
        await Product.updateOne({
                _id: req.params.id
            }, req.body)
            .then(() => res.redirect('/admin/product/list'))
            .catch(next);
    }
    //gelley
    async store_img(req, res, next) {
        var id = req.params.id;

        var arr = req.files;
        arr.forEach(async (img) => {
            const image = img.path.split('\\').slice(1).join('/');
            const str = image.substring(6);
            const store = new Image({
                masp: id,
                hinhanh: str
            });
            await store.save();
            res.redirect('back');
        })
    }
    //add laptop
    add_laptop(req, res, next){
        var id = req.params.id;
        res.render('admin/product/add-laptop', {
            title: 'Thêm chi tiết laptop',
            id: id,
            layout: 'main-admin.hbs'
        })
    }
    async store_laptop(req, res, next){
        var id = req.params.id;

        var laptop = new Laptop(req.body);
        await laptop.save();

        res.redirect('/admin/product/detail-product/'+ id)

    }
    //add laptop
    add_dt(req, res, next){
        var id = req.params.id;
        res.render('admin/product/add-dt', {
            title: 'Thêm chi tiết điện thoại',
            id: id,
            layout: 'main-admin.hbs'
        })
    }
    async store_dt(req, res, next){
        var id = req.params.id;

        var phone = new Smartphone(req.body);
        await phone.save();

        res.redirect('/admin/product/detail-product/'+ id)

    }
    //dell
    async delete(req, res, next) {
        await Product.deleteOne({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    }


}
module.exports = new ProductController;

const productController = require('./ProductController');