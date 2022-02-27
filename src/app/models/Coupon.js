const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Coupon = new Schema({
    magg: { type: Number, maxlength: 5, unique: true},
    tenma: { type: String, maxlength: 50, required: true},
    mota: { type: String, maxlength: 100,required: true},
    hinhthuc: { type: Number, required: true}, //1 giam theo tien, 2 giam theo %
    mucgiam: { type: Number, required: true},
    trangthai: { type: Number, default: '1'}// 1 su dung, 0 khong su dung
  },
  {
      timestamps: true
  });

Coupon.plugin(AutoIncrement, {inc_field: 'magg'});
module.exports = mongoose.model('coupon', Coupon);
