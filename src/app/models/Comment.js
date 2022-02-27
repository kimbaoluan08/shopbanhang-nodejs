const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Comment = new Schema({
    mabl: { type: Number, maxlength: 5, unique: true},
    masp: { type: Number, maxlength: 5, required: true},
    idnguoidung: { type: Number, maxlength: 5, required: true},
    tenkh: { type: String, maxlength: 100, required: true},
    noidung: { type: String, maxlength: 255, required: true},
    danhgia: { type: Number, maxlength: 5},
    tinhtrang: { type: Number, default: '0'},
  },
  {
      timestamps: true
  });

Comment.plugin(AutoIncrement, {inc_field: 'mabl'});
module.exports = mongoose.model('comment', Comment);
