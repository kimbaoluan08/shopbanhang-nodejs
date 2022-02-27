const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');

requireAuth = (req, res, next) => {

    const token = req.session.user;

    if (token){
        jwt.verify(token,"" + process.env.TOKEN_KEY,(err, DecodedToken) => {
            if (err){
                res.redirect('/user/login'); 
            } else {
                next();
            }
        })
    } else {
        res.redirect('/user/login');
    }
}

// checkCart = (req, res, next) => {
//     var cart = new Cart(req.session.cart);
//     console.log(cart.generateArray());
// }

const authJwt = {
    requireAuth: requireAuth
  };
module.exports = authJwt;


