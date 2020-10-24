const express = require('express');

const router = express.Router();
const controller = require('../controllers/user');

router.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ err: 'Authorization error' });
  }
});

router.post('/', controller.createUser);
router.get('/list', controller.listUsers);
router.get('/:id', controller.getUser);
router.delete('/:id', controller.deleteUser);
router.put('/:id', controller.updateUser);

module.exports = router;
