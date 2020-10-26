const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const User = require('../models/user');
const { USER_RESOURCE } = require('../constants');

const controller = {};

controller.getProfile = async (req, res) => {
  try {
    const user = await User.getUserById(req.user._id);
    if (!user) {
      res.status(404).json({ err: 'Cannot find user' });
      return;
    }
    const userJson = user.toJSON();
    res.json({ user: _.pick(userJson, USER_RESOURCE) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Server error' });
  }
};

controller.deleteProfile = async (req, res) => {
  try {
    const user = await User.getUserById(req.user._id);
    if (!user) {
      res.status(404).json({ err: 'Cannot find user' });
      return;
    }

    await user.remove();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Server error' });
  }
};

controller.updatePreferredHours = async (req, res) => {
  const schema = Joi.object({
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

    user.preferredHours = value.preferredHours;
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
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
    const user = await User.getUserById(req.user._id);
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
    console.error(err);
    res.status(500).json({ err: 'Server error' });
  }
};

module.exports = controller;
