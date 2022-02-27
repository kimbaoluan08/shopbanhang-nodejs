const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Product = new Schema({
    masp: { type: Number,  maxlength: 5, unique: true},
    tensp: { type: String, maxlength: 255, required: true},
    hinhanh: { type: String, maxlength: 255, required: true},
    giaban: { type: Number, required: true},
    giagoc: { type: Number, required: true},
    soluong: { type: Number, required: true},
    mota: { type: String },
    trangthai: { type: Number, default: '1'}, //1 hien 0 an
    maloai: { type: Number, required: true},
    math: { type: Number, required: true},
    slugsp: { type: String, slug: 'tensp', unique: true},
  }, 
  {
      timestamps: true
  });

//plugin
Product.plugin(AutoIncrement, {inc_field: 'masp'});
mongoose.plugin(slug);

module.exports = mongoose.model('product', Product);