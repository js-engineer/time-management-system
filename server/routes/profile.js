const express = require('express');

const router = express.Router();
const controller = require('../controllers/profile');

router.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ err: 'Authorization error' });
  }
});

router.get('/', controller.getProfile);
router.delete('/', controller.deleteProfile);
router.put('/preferredHours', controller.updatePreferredHours);
router.put('/password', controller.updatePassword);

module.exports = router;
