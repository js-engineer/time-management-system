const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Record = require('../models/record');

const controller = {};

controller.deleteProfile = async (req, res) => {
  try {
    const user = await User.getUserById(req.user._id);
    if (!user) {
      res.status(404).json({ err: 'Cannot find user' });
      return;
    }

    await Record.where('user', user).remove();
    await user.remove();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

controller.updateSettings = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    preferredHours: Joi.number().required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    const err =
      error.details.length > 0 ? error.details[0].message : 'Invalid request';
    return res.status(400).json({ err });
  }

  try {
    const user = await User.getUserById(req.user._id);
    if (!user) {
      res.status(404).json({ err: 'Cannot find user' });
      return;
    }

    user.name = value.name;
    user.preferredHours = value.preferredHours;
    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

controller.updatePassword = async (req, res) => {
  const schema = Joi.object({
    old: Joi.string().required(),
    new: Joi.string().required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    const err =
      error.details.length > 0 ? error.details[0].message : 'Invalid request';
    return res.status(400).json({ err });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ err: 'Cannot find user' });
      return;
    }

    if (!bcrypt.compareSync(value.old, user.password)) {
      res.status(403).json({ err: 'Wrong password' });
      return;
    }

    user.password = bcrypt.hashSync(value.new, bcrypt.genSaltSync(10), null);
    await user.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

module.exports = controller;
