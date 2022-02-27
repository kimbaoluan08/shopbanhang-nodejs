const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

Auth = (req, res, next) => {

    const token = req.cookies.jwt_admin;
    if (token){
        jwt.verify(token,"" + process.env.TOKEN_KEY,(err, DecodedToken) => {
            if (err){
                res.redirect('/admin'); 
            } else {
                next();
            }
        })
    } else {
        res.redirect('/admin');
    }
}
//admin
CheckRole = (req, res, next) => {
    const token = req.cookies.jwt_admin;
    jwt.verify(token,"" + process.env.TOKEN_KEY,async (err, DecodedToken) => {
        if (err){
            res.redirect('/admin'); 
        } else {
            var role = await Admin.findOne({ id: DecodedToken }).exec();
            if (role.maquyen == 1){
                next();
            } else {
                res.render('errors/403', {
                    title: 'Lỗi truy cập',
                    layout: 'main-errors.hbs'
                })
            }
        }
    })
}
//Nhan vien them san pham
CheckRole_1 = (req, res, next) => {
    const token = req.cookies.jwt_admin;
    jwt.verify(token,"" + process.env.TOKEN_KEY,async (err, DecodedToken) => {
        if (err){
            res.redirect('/admin'); 
        } else {
            var role = await Admin.findOne({ id: DecodedToken }).exec();
            if (role.maquyen == 1 || role.maquyen == 2){
                next();
            } else {
                res.render('errors/403', {
                    title: 'Lỗi truy cập',
                    layout: 'main-errors.hbs'
                })
            }
        }
    })
}
//Nhan vien duyet
CheckRole_2 = (req, res, next) => {
    const token = req.cookies.jwt_admin;
    jwt.verify(token,"" + process.env.TOKEN_KEY,async (err, DecodedToken) => {
        if (err){
            res.redirect('/admin'); 
        } else {
            var role = await Admin.findOne({ id: DecodedToken }).exec();
            if (role.maquyen == 1 || role.maquyen == 3){
                next();
            } else {
                res.render('errors/403', {
                    title: 'Lỗi truy cập',
                    layout: 'main-errors.hbs'
                })
            }
        }
    })
}


const authJwt = {
    Auth: Auth,
    CheckRole: CheckRole,
    CheckRole_1: CheckRole_1,
    CheckRole_2: CheckRole_2
  };
module.exports = authJwt;


