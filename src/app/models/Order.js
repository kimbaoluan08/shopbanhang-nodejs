const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Order = new Schema({
    madh: { type: Number,  maxlength: 5, unique: true},
    idkh: { type: Number, required: true},
    tenkh: { type: String, maxlength: 100, required: true },
    madc: { type: Number, maxlength: 5},
    sdt: { type: String, maxlength: 100, required: true },
    email: { type: String, maxlength: 100, required: true },
    ghichu: { type: String, maxlength: 255 },
    tongtien: {type: Number, required: true},
    hinhthuctt: { type: String, maxlength: 100, required: true },
    tinhtrang: { type: Number, default: '1'},//1 chua xac nhan, 2 da xac nhan, 3 dang giao hang, 4 da giao hang, 5 huy
    idnv: { type: Number }//id nhan vien duyet don hang
  },
  {
      timestamps: true
  });

Order.plugin(AutoIncrement, {inc_field: 'madh'});
module.exports = mongoose.model('order', Order);
