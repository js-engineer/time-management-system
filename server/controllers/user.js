const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { USER_ROLE } = require('../constants');

const controller = {};

controller.createUser = async (req, res) => {
  if (
    req.user.role !== USER_ROLE.MANAGER &&
    req.user.role !== USER_ROLE.ADMIN
  ) {
    return res.status(403).json({ err: 'No permission' });
  }

  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    preferredHours: Joi.number().required(),
    role: Joi.string().valid(USER_ROLE.REGULAR, USER_ROLE.MANAGER).required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    const err =
      error.details.length > 0 ? error.details[0].message : 'Invalid request';
    return res.status(400).json({ err });
  }

  try {
    const existingUser = await User.getUserByEmail(value.email);
    if (existingUser) {
      return res.status(400).json({ err: 'User already exists' });
    }

    await User.createUser({
      name: value.name,
      email: value.email,
      emailVerified: true,
      password: bcrypt.hashSync(value.password, bcrypt.genSaltSync(10), null),
      preferredHours: value.preferredHours,
      role: value.role,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

controller.listUsers = async (req, res) => {
  if (
    req.user.role !== USER_ROLE.MANAGER &&
    req.user.role !== USER_ROLE.ADMIN
  ) {
    return res.status(403).json({ err: 'No permission' });
  }

  const schema = Joi.object({
    pageNum: Joi.number().integer().positive().required(),
    pageSize: Joi.number().integer().positive().required(),
  });
  const { error, value } = schema.validate(req.query);
  if (error) {
    const err =
      error.details.length > 0 ? error.details[0].message : 'Invalid request';
    return res.status(400).json({ err });
  }

  try {
    const totalCounts = await User.countUsers();
    const users = await User.listUsers(value.pageNum, value.pageSize);
    res.json({ totalCounts, users });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

controller.getUser = async (req, res) => {
  if (
    req.user.role !== USER_ROLE.MANAGER &&
    req.user.role !== USER_ROLE.ADMIN
  ) {
    return res.status(403).json({ err: 'No permission' });
  }
  try {
    const user = await User.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ err: 'Cannot find user' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

controller.deleteUser = async (req, res) => {
  if (
    req.user.role !== USER_ROLE.MANAGER &&
    req.user.role !== USER_ROLE.ADMIN
  ) {
    return res.status(403).json({ err: 'No permission' });
  }
  try {
    const user = await User.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ err: 'Cannot find user' });
    }
    await user.remove();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

controller.updateUser = async (req, res) => {
  if (
    req.user.role !== USER_ROLE.MANAGER &&
    req.user.role !== USER_ROLE.ADMIN
  ) {
    return res.status(403).json({ err: 'No permission' });
  }

  const schema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    preferredHours: Joi.number().optional(),
    role: Joi.string().valid(USER_ROLE.REGULAR, USER_ROLE.MANAGER).optional(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    const err =
      error.details.length > 0 ? error.details[0].message : 'Invalid request';
    return res.status(400).json({ err });
  }

  try {
    const user = await User.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ err: 'Cannot find user' });
    }

    const keys = Object.keys(value);
    keys.forEach((key) => {
      user[key] = value[key];
    });

    await user.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

module.exports = controller;
