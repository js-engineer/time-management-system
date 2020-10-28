const express = require('express');

const router = express.Router();
const controller = require('../controllers/record');

router.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ err: 'Authorization error' });
  }
});

router.post('/', controller.createRecord);
router.get('/list/all', controller.listAllRecords);
router.get('/download/all', controller.downloadAllRecordSheet);
router.get('/list/:userId', controller.listUserRecords);
router.get('/download/:userId', controller.downloadUserRecordSheet);
router.get('/by-date', controller.getRecordByUserAndDate);
router.get('/:id', controller.getRecordById);
router.delete('/:id', controller.deleteRecord);
router.put('/:id', controller.updateRecord);

module.exports = router;
