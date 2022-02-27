const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Customer = new Schema({
    idnguoidung: { type: Number, maxlength: 5, unique: true},
    hoten: { type: String, maxlength: 255, required: true},
    tendn: { type: String, maxlength: 100, required: true, unique: true},
    matkhau: { type: String, maxlength: 255, required: true},
    gioitinh: { type: Number, required: true},
    sdt: { type: String, maxlength: 10, required: true},
    email: { type: String, maxlength: 255, required: true},
    tinhtrang: { type: Number, default: '1'}
  },
  {
      timestamps: true
  });

Customer.plugin(AutoIncrement, {inc_field: 'idnguoidung'});
module.exports = mongoose.model('customer', Customer);
