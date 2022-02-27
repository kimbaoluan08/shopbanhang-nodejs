const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const Brand = new Schema({
    mathuonghieu: { type: Number, maxlength: 5, unique: true },
    tenth: { type: String, maxlength: 50, required: true},
    maloai: { type: Number, required: true },
    trangthai: { type: Number, default: '1'},
  },
  {
      timestamps: true
  });


//plugin
Brand.plugin(AutoIncrement, {inc_field: 'mathuonghieu'});
mongoose.plugin(slug);

module.exports = mongoose.model('brand', Brand);
