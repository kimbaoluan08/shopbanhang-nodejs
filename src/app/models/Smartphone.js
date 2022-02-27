const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Smartphone = new Schema({
    masp: { type: Number, maxlength: 5, required:true, unique: true},
    manhinh: { type: String, maxlength: 50, required: true},
    camera: { type: String, maxlength: 50, required: true},
    ram: { type: String, maxlength: 50, required: true},
    rom: { type: String, maxlength: 50, required: true},
    pin: { type: String, maxlength: 50, required: true},
    hdh: { type: String, maxlength: 50, required: true},
    xuatxu: { type: String, maxlength: 50, required: true},
    namsx: { type: Number, required: true}
  },
  {
      timestamps: true
  });

module.exports = mongoose.model('smartphone', Smartphone);