const mongoose = require('mongoose');
const { USER_ROLE } = require('../constants');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(USER_ROLE),
    required: true,
    default: USER_ROLE.REGULAR,
  },
  preferredHours: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

User.createUser = async (data) => {
  const newUser = await User(data).save();
  return newUser;
};

User.getUserByEmail = (email) =>
  User.findOne({
    email,
  });

User.countUsers = (dbQuery) => User.countDocuments(dbQuery);

User.listUsers = (dbQuery, pageSize) =>
  User.find(dbQuery).sort('-createdAt').limit(pageSize).lean();

User.getUserById = (id) => User.findById(id);

module.exports = User;
