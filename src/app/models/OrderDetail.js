const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderDetail = new Schema({
    id: { type: Number, required: true}, //id don hang
    idsp: { type: Number, maxlength: 5, required: true},
    hinhanh: { type: String, maxlength: 255, required: true },
    tensp: { type: String, maxlength: 100, required: true },
    soluong: { type: Number},
    giatien: {type: Number}
  },
  {
      timestamps: true
  });

  module.exports = mongoose.model('orderdetail', OrderDetail);