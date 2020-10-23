const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/jwt');

router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(401).json({
        message: 'Auth failed',
      });
    }
    if (!user) {
      console.log('No user found.');
      return res.status(401).json({
        message: 'Auth failed',
      });
    }
    if (!user.validPassword(req.body.password)) {
      req.flash('error', 'Wrong password');
      return res.status(401).json({
        message: 'Auth failed',
      });
    }
    console.log('logged in');
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '12h',
      }
    );
    return res.status(200).json({
      message: 'Auth successful',
      token,
      uid: user._id,
    });
  }).catch((err) => {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  });
});

router.post('/register', (req, res) => {
  try {
    const user = new User();
    user.email = req.body.email;
    user.password = user.encryptPassword(req.body.password);
    user.created_At = Date.now();
    user.save((err) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: 'An error has occured.',
        });
      } else {
        res.status(201).json({
          message: 'User created.',
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'An error has occured.',
    });
  }
});

router.get('/user/:uid', auth.checkToken, (req, res) => {
  User.findOne({ _id: req.params.uid }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(401).json({
        message: 'User does not exist.',
      });
    }
    if (user) {
      console.log('logged in');
      return res.status(200).json({
        message: 'user found',
        uid: user._id,
        email: user.email,
        joined: user.created_At,
      });
    }
    return res.status(401).json({
      message: 'User does not exist.',
    });
  }).catch((err) => {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  });
});

module.exports = router;
