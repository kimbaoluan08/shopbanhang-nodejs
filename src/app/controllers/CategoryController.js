const Category = require('../models/Category');
const { mongooseToObject } = require('../../util/mongoose');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class CategoryController {
    //get
    create(req, res, next) {
       res.render('admin/product/create-category', { title: "Thêm danh mục", layout: "main-admin.hbs"});
    }
    //post
    async store(req, res, next) {
        //res.json(req.body);
        const cate = new Category(req.body);
        await cate.save()
            .then(() => {
                req.session.message = {
                    success: 'Thêm danh mục thành công!'
                };
                res.redirect('/admin/category/list')
            })
            .catch(next);     
    }
    //get-list
    list(req, res, next) {
        Category.find({})
            .then(cate => {
                res.render('admin/product/list-category', {
                    cate: mutipleMongooseToObject(cate), title: "Danh sách danh mục", layout: 'main-admin.hbs'
                });
            })
            .catch(next);
     }
    //edit
    async edit(req, res, next) {
        await Category.findById(req.params.id)
            .then(cate => res.render('admin/product/edit-category', {
                cate: mongooseToObject(cate), title: "Sửa danh mục", layout: 'main-admin.hbs' 
            }))
            .catch(next);
        
    }
    //PUT update
    update(req, res, next) {
        Category.updateOne({ _id: req.params.id}, req.body)
            .then(() => res.redirect('/admin/category/list'))
            .catch(next);
    }
    //Delete
    delete(req, res, next) {
        Category.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

}
module.exports = new CategoryController ;

const categoryController = require('./CategoryController');