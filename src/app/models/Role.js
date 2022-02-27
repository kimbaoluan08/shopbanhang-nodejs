const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Role = new Schema({
    idquyen: {type: Number, required: true},
    tenquyen: {type: String, required: true }
  },
  {
      timestamps: true
  });

module.exports = mongoose.model('role', Role);