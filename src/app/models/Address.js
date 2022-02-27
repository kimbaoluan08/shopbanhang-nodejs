const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Address = new Schema({
    madc: { type: Number, maxlength: 5, unique: true},
    idnguoidung: { type: Number, maxlength: 5},
    diachi: { type: String, maxlength: 255, required: true},
  },
  {
      timestamps: true
  });

Address.plugin(AutoIncrement, {inc_field: 'madc'});
module.exports = mongoose.model('address', Address);
