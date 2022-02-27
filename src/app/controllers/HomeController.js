const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Cart = require('../models/Cart')
const Coupon = require('../models/Coupon');
const Image = require('../models/Image');
const {
  mutipleMongooseToObject
} = require('../../util/mongoose');
const {
  mongooseToObject
} = require('../../util/mongoose');

class HomeController {
  //get /
  async index(req, res, next) {
    await Product.find().limit(5)
      .then(async product => {
        var dt = await Product.find({ maloai: 2 }).limit(5).exec();
        res.render('user/home', {
          product: mutipleMongooseToObject(product),
          dt: mutipleMongooseToObject(dt),
          title: "Shoppe",
          layout: 'main-user.hbs'
        });
      })
      .catch(next);
  }
  //contact
  contact(req, res, next) {
    res.render('user/contact', {
      title: 'Liên hệ',
      layout: 'main-user.hbs'
    })
  }
  //
  dienthoai(req, res, next) {
    Brand.find({
      maloai: '2'
    }).exec((err, brand) => {
      if (err) {
        return res.status(400).json({
          error: 'Erorr en STATUS1'
        })
      }
      Product.aggregate([{
          $lookup: {
            from: "smartphones",
            localField: "masp",
            foreignField: "masp",
            as: "phone"
          }
        },
        {
          $match: {
            maloai: 2,
          }
        }
      ]).exec(async function (err, result) {
        //res.json(result);
        res.render('user/smartphone', {
          title: 'Điện thoại',
          brand: mutipleMongooseToObject(brand),
          product: result,
          layout: 'main-user.hbs',
          dt: 'active'
        })
      })
    })
}
//chi tiet dien thoai
chitietdt(req, res, next) {
  const slug = req.params.slug;
  var id = req.params.id;
  Product.aggregate([{
      $lookup: {
        from: "comments",
        localField: "masp",
        foreignField: "masp",
        as: "comment"
      }
    },
    {
      $lookup: {
        from: "images",
        localField: "masp",
        foreignField: "masp",
        as: "image"
      },
    },
    {
      $lookup: {
        from: "smartphones",
        localField: "masp",
        foreignField: "masp",
        as: "phone"
      }
    },
    {
      $match: {
        slugsp: slug,
      }
    }
  ]).exec(async function (err, result) {
    // res.json(result);
    var sp = await Product.find({ maloai: 2 }).limit(4).exec();
    res.render('user/product', {
      title: slug,
      product: result,
      sp: mutipleMongooseToObject(sp),
      layout: 'main-user.hbs',
      dt: 'active'
    });
  })
}
//laptop
laptop(req, res, next) {
  Brand.find({
    maloai: '1'
  }).exec((err, brand) => {
    if (err) {
      return res.status(400).json({
        error: 'Erorr en STATUS1'
      })
    }
    Product.aggregate([{
        $lookup: {
          from: "laptops",
          localField: "masp",
          foreignField: "masp",
          as: "laptop"
        }
      },
      {
        $match: {
          maloai: 1,
        }
      }
    ]).exec(async function (err, result) {
      //res.json(result);
      res.render('user/laptop', {
        title: 'Laptop',
        brand: mutipleMongooseToObject(brand),
        product: result,
        layout: 'main-user.hbs',
        laptop: 'active'
      })
    })
  })
}
//chi tiet laptop
chitietlaptop(req, res, next) {
  const slug = req.params.slug;
  var id = req.params.id;
  Product.aggregate([{
      $lookup: {
        from: "comments",
        localField: "masp",
        foreignField: "masp",
        as: "comment"
      }
    },{
      $lookup: {
        from: "images",
        localField: "masp",
        foreignField: "masp",
        as: "image"
      }
    },
    {
      $lookup: {
        from: "laptops",
        localField: "masp",
        foreignField: "masp",
        as: "laptop"
      }
    },
    {
      $match: {
        slugsp: slug,
      }
    }
  ]).exec(async function (err, result) {
    var sp = await Product.find({ maloai: 1 }).limit(4).exec();
   
    res.render('user/product', {
      title: slug,
      product: result,
      sp: mutipleMongooseToObject(sp),
      layout: 'main-user.hbs',
      laptop: 'active'
    });
  })
}
//Phu kien
phukien(req, res, next) {
  Brand.find({
    maloai: '3'
  }).exec((err, brand) => {
    if (err) {
      return res.status(400).json({
        error: 'Erorr en STATUS1'
      })
    }
    Product.aggregate([{
        $lookup: {
          from: "laptops",
          localField: "masp",
          foreignField: "masp",
          as: "laptop"
        }
      },
      {
        $match: {
          maloai: 3,
        }
      }
    ]).exec(async function (err, result) {
      //res.json(result);
      res.render('user/phukien', {
        title: 'Laptop',
        brand: mutipleMongooseToObject(brand),
        product: result,
        layout: 'main-user.hbs',
        pk: 'active'
      })
    })
  })
}

chitietpk(req, res, next) {
  const slug = req.params.slug;
  var id = req.params.id;
  Product.aggregate([{
      $lookup: {
        from: "comments",
        localField: "masp",
        foreignField: "masp",
        as: "comment"
      }
    },
    {
      $match: {
        slugsp: slug,
      }
    }
  ]).exec(async function (err, result) {
    var sp = await Product.find({ maloai: 3 }).limit(4).exec();
   
    res.render('user/product', {
      title: slug,
      product: result,
      sp: mutipleMongooseToObject(sp),
      layout: 'main-user.hbs',
      pk: 'active'
    });
  })
}

//get add-cart 
async add_cart(req, res, next) {
  const productId = req.params.id;
  var qty = req.body.soluong;

  const cart = new Cart(req.session.cart ? req.session.cart : {});

  await Product.findOne({
    masp: productId
  }, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    if (qty <= 0) {
      req.session.message = {
        error_1: 'Số lượng sản phẩm vượt quá kho',
      };
      res.redirect('back');
    } else {
      if (product.soluong < qty) {
        req.session.message = {
          error: 'Số lượng sản phẩm vượt quá kho',
          soluong: product.soluong
        };
        res.redirect('back');

      } else {
        cart.add(product, product.masp, qty);
        req.session.cart = cart;

        req.session.message = {
          success: 'Thêm vào giỏ hàng thành công'
        };
        res.redirect('back');
      }
    }
  });
}
//view cart
async view_cart(req, res, next) {
  if (!req.session.cart) {
    res.render('user/cart/view-cart', {
      products: null,
      title: 'Giỏ hàng',
      layout: 'main-user.hbs'
    });
  } else {
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

    //console.log(req.session.cart);

    res.render('user/cart/view-cart', {
      products: cart.generateArray(),
      title: 'Giỏ hàng',
      totalPrice: total,
      layout: 'main-user.hbs'
    });
  }
}
//
async update_cart(req, res, next) {
  var id = req.params.id;
  var qty = req.body.soluong;

  const cart = new Cart(req.session.cart ? req.session.cart : {});

  await Product.findOne({
    masp: id
  }, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    if (qty <= 0) {
      req.session.message = {
        error_1: 'Số lượng sản phẩm vượt quá kho',
      };
      res.redirect('/gio-hang');
    } else {
      if (product.soluong < qty) {
        req.session.message = {
          error: 'Số lượng sản phẩm vượt quá kho',
          soluong: product.soluong
        };
        res.redirect('/gio-hang');

      } else {
        cart.update(id, qty);
        req.session.cart = cart;

        req.session.message = {
          success: 'Thêm vào giỏ hàng thành công'
        };
        res.redirect('/gio-hang');
      }
    }
  });
}
 
async remove(req, res, next) {
  var id = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  await cart.removeItem(id);
  req.session.cart = cart;
  delete req.session.coupon;

  res.redirect('/gio-hang');
}
//search
async searchProducts(req, res, next) {
  let payload = req.body.payload.trim();
  let search = await Product.find({
    tensp: {
      $regex: new RegExp('.*' + payload + '.*', 'i')
    }
  }).exec();

  //Gioi han tim
  search = search.slice(0, 10);
  res.send({
    payload: search
  });
}
//coupon
async check_coupon(req, res, next) {
  var coupon = await Coupon.findOne({
    tenma: req.body.magg
  });
  req.session.coupon = {
    mota: coupon.mota,
    mucgiam: coupon.mucgiam
  };
  console.log(req.session.coupon);
  res.redirect('back');
}

async del_coupon(req, res, next) {
  await delete req.session.coupon;
  res.redirect('back');
}
}
module.exports = new HomeController;

const homeController = require('./HomeController');