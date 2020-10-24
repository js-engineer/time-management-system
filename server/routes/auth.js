const express = require('express');

const router = express.Router();
const controller = require('../controllers/auth');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/check-token', controller.checkToken);
router.post('/verify-email', controller.verifyEmail);

module.exports = router;
