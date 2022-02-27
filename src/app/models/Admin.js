const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const User = new Schema({
    id: { type: Number, maxlength: 5, unique: true},
    hoten: { type: String, maxlength: 255, required: true},
    taikhoan: { type: String, maxlength: 100, required: true, unique: true},
    matkhau: { type: String, maxlength: 255, required: true},
    tinhtrang: { type: Number, default: '1'},
    maquyen: {type: Number, required: true}
  },
  {
      timestamps: true
  });

User.plugin(AutoIncrement, {inc_field: 'id'});
module.exports = mongoose.model('user', User);
