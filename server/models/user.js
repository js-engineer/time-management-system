const mongoose = require('mongoose');

const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  created_at: Date,
});

userSchema.methods.encryptPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);

userSchema.methods.validPassword = (password) =>
  bcrypt.compareSync(password, this.password);

module.exports = mongoose.model('User', userSchema);
