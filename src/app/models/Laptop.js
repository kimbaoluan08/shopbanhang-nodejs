const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Laptop = new Schema({
    masp: { type: Number, maxlength: 5, unique: true},
    cpu: { type: String, maxlength: 50, required: true},
    ram: { type: String, maxlength: 50, required: true},
    manhinh: { type: String, maxlength: 50, required: true},
    ocung: { type: String, maxlength: 50, required: true},
    hdh: { type: String, maxlength: 50, required: true},
    xuatxu: { type: String, maxlength: 50, required: true},
    namsx: { type: Number, required: true}
  },
  {
      timestamps: true
  });

module.exports = mongoose.model('laptop', Laptop);