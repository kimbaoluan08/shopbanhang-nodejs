const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Category = new Schema({
    madanhmuc: { type: Number, maxlength: 5, unique: true},
    tendanhmuc: { type: String, maxlength: 50, required: true},
    mota: { type: String, maxlength: 255},
    trangthai: { type: Number, default: '1'}, //1 hien 0 an
    slugloai: { type: String, slug: 'tendanhmuc', unique: true}
  },
  {
      timestamps: true
  });

//plugin
Category.plugin(AutoIncrement, {inc_field: 'madanhmuc'});
mongoose.plugin(slug);

module.exports = mongoose.model('category', Category);