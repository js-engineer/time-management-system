const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const sgMail = require('@sendgrid/mail');
const User = require('../models/user');
const Token = require('../models/token');

const controller = {};

controller.register = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    preferredHours: Joi.number().required(),
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
      res.status(400).json({ err: 'User already exists' });
      return;
    }

    const newUser = await User.createUser({
      name: value.name,
      email: value.email,
      password: bcrypt.hashSync(value.password, bcrypt.genSaltSync(10), null),
      preferredHours: value.preferredHours,
    });

    const emailToken = await Token.createToken(newUser._id);
    const msg = {
      to: value.email,
      from: 'prime.dev22@gmail.com',
      subject: 'Email Verification for Time Management.',
      html: `Click <a href="${process.env.FRONTEND_URL}/verify-email/${emailToken.token}">here</a> to verify the email.`,
    };

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send(msg);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

controller.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    const err =
      error.details.length > 0 ? error.details[0].message : 'Invalid request';
    return res.status(400).json({ err });
  }

  try {
    const user = await User.getUserByEmail(value.email);
    if (!user) {
      res.status(401).json({ err: 'Email or password is invalid' });
      return;
    }

    if (!bcrypt.compareSync(value.password, user.password)) {
      res.status(401).json({ err: 'Email or password is invalid' });
      return;
    }

    if (!user.emailVerified) {
      res.status(403).json({ err: 'Email is not verified yet' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      {
        expiresIn: '12h',
      }
    );

    return res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

controller.verifyEmail = async (req, res) => {
  const schema = Joi.object({
    token: Joi.string().required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    const err =
      error.details.length > 0 ? error.details[0].message : 'Invalid request';
    return res.status(400).json({ err });
  }

  try {
    const token = await Token.getToken(value.token);
    if (!token) {
      res.status(401).json({ err: 'Invalid token' });
      return;
    }

    const user = await User.getUserById(token.user);
    if (!user) {
      res.status(404).json({ err: 'Cannot find user' });
      return;
    }

    user.emailVerified = true;
    await user.save();

    await token.remove();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

controller.checkToken = (req, res) => {
  if (req.user) {
    const token = jwt.sign(req.user, process.env.SECRET_KEY, {
      expiresIn: '12h',
    });
    res.json({
      token,
      user: req.user,
    });
  } else {
    res.status(401).json({ err: 'Invalid token' });
  }
};

module.exports = controller;
