const Brand = require('../models/Brand');
const Category = require('../models/Category');
const {
    mongooseToObject
} = require('../../util/mongoose');
const {
    mutipleMongooseToObject
} = require('../../util/mongoose');


class BrandController {
    //get
    create(req, res, next) {
        Category.find({})
            .then(cate => {
                res.render('admin/product/create-brand', {
                    cate: mutipleMongooseToObject(cate),
                    title: "Thêm thương hiệu",
                    layout: "main-admin.hbs"
                });
            })
            .catch(next);
    }
    //post
    store(req, res, next) {
        //res.json(req.body);
        const cate = new Brand(req.body);
        cate.save()
            .then(() => res.redirect('/admin/brand/list'))
            .catch(next);
    }
    //get-list
    list(req, res, next) {
        Brand.aggregate([{
                $lookup: {
                    from: "categories",
                    localField: "maloai",
                    foreignField: "madanhmuc",
                    as: "cate"
                }
            },
            {
                $sort: {
                    maloai: 1
                }
            }
        ]).exec(function (err, result) {
            //res.json(result);
            res.render('admin/product/list-brand', {
                brand: result,
                title: "Danh sách thương hiệu",
                layout: 'main-admin.hbs'
            });
        })
    }
    //edit
    async edit(req, res, next) {
        var id = req.params.id;
        await Brand.findOne({
            _id: id
        }).exec((err, result) => {
            Category.find().exec((err, result_1) => {
                res.render('admin/product/edit-brand', {
                    title: 'Sửa thông tin nhân viên',
                    brand: mongooseToObject(result),
                    cate: mutipleMongooseToObject(result_1),
                    layout: 'main-admin.hbs'
                })
            })
        })
    }
    //PUT update
    update(req, res, next) {
        Brand.updateOne({
                _id: req.params.id
            }, req.body)
            .then(() => res.redirect('/admin/brand/list'))
            .catch(next);
    }
    //Delete
    delete(req, res, next) {
        Brand.deleteOne({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    }

}
module.exports = new BrandController;

const brandController = require('./BrandController');