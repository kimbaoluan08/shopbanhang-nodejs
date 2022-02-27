const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Image = new Schema({
    masp: { type: Number, required: true},
    hinhanh: { type: String, maxlength: 255, required: true}
  },
  {
      timestamps: true
  });

module.exports = mongoose.model('image', Image);
