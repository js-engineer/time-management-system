const Joi = require('joi');
const Record = require('../models/record');
const User = require('../models/user');
const { USER_ROLE } = require('../constants');

const controller = {};

controller.createRecord = async (req, res) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    date: Joi.date().required(),
    notes: Joi.array().items(Joi.string()).required(),
    hours: Joi.number().required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    const err =
      error.details.length > 0 ? error.details[0].message : 'Invalid request';
    return res.status(400).json({ err });
  }
  try {
    const user = await User.getUserById(value.user);
    if (!user) {
      return res.status(404).json({ err: 'Cannot find user' });
    }
    if (value.user !== req.user.id && req.user.role !== USER_ROLE.ADMIN) {
      return res.status(403).json({ err: 'No permission' });
    }
    const existingRecord = await Record.getRecordByUserAndDate(
      req.user.id,
      value.date
    );
    if (existingRecord) {
      return res.status(404).json({ err: 'Record already exists' });
    }
    const record = await Record.createRecord(value);
    res.json({ record });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

controller.listUserRecords = async (req, res) => {
  const schema = Joi.object({
    from: Joi.date().optional(),
    to: Joi.date().optional(),
    pageNum: Joi.number().integer().positive().required(),
    pageSize: Joi.number().integer().positive().required(),
  });
  const { error, value } = schema.validate(req.query);
  if (error) {
    const err =
      error.details.length > 0 ? error.details[0].message : 'Invalid request';
    return res.status(400).json({ err });
  }

  if (req.user.id !== req.params.userId && req.user.role !== USER_ROLE.ADMIN) {
    return res.status(403).json({ err: 'No permission' });
  }

  try {
    const query = { user: req.params.userId };
    if (value.from || value.to) {
      query.date = Object.assign(
        value.from ? { $gte: value.from } : {},
        value.to ? { $lte: value.to } : {}
      );
    }

    const totalCounts = await Record.countRecords(query);
    const records = await Record.listRecords(
      query,
      value.pageNum,
      value.pageSize
    );
    res.json({
      totalCounts,
      records,
    });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

controller.listAllRecords = async (req, res) => {
  if (req.user.role !== USER_ROLE.ADMIN) {
    return res.status(403).json({ err: 'No permission' });
  }

  const schema = Joi.object({
    from: Joi.date().optional(),
    to: Joi.date().optional(),
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
    const query = {};
    if (value.from || value.to) {
      query.date = Object.assign(
        value.from ? { $gte: value.from } : {},
        value.to ? { $lte: value.to } : {}
      );
    }
    const totalCounts = await Record.countRecords(query);
    const records = await Record.listRecords(
      query,
      value.pageNum,
      value.pageSize
    );
    res.json({
      totalCounts,
      records,
    });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

controller.getRecordById = async (req, res) => {
  try {
    const record = await Record.getRecordById(req.params.id);

    if (!record) {
      return res.status(404).json({ err: 'Cannot find record' });
    }

    if (
      record.user.toString() !== req.user.id &&
      req.user.role !== USER_ROLE.ADMIN
    ) {
      return res.status(403).json({ err: 'No permission' });
    }
    res.json({ record });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

controller.getRecordByUserAndDate = async (req, res) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    date: Joi.date().required(),
  });
  const { error, value } = schema.validate(req.query);

  if (error) {
    const err =
      error.details.length > 0 ? error.details[0].message : 'Invalid request';
    return res.status(400).json({ err });
  }
  if (value.user !== req.user.id && req.user.role !== USER_ROLE.ADMIN) {
    return res.status(403).json({ err: 'No permission' });
  }
  try {
    const record = await Record.getRecordByUserAndDate(value.user, value.date);
    if (!record) {
      return res.status(404).json({ err: 'Cannot find record' });
    }
    res.json({ record });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

controller.deleteRecord = async (req, res) => {
  try {
    const record = await Record.getRecordById(req.params.id);

    if (!record) {
      return res.status(404).json({ err: 'Cannot find record' });
    }

    if (
      record.user.toString() !== req.user.id &&
      req.user.role !== USER_ROLE.ADMIN
    ) {
      return res.status(403).json({ err: 'No permission' });
    }
    await record.remove();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

controller.updateRecord = async (req, res) => {
  const schema = Joi.object({
    notes: Joi.array().items(Joi.string()).required(),
    hours: Joi.number().required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    const err =
      error.details.length > 0 ? error.details[0].message : 'Invalid request';
    return res.status(400).json({ err });
  }
  try {
    const record = await Record.getRecordById(req.params.id);
    if (!record) {
      return res.status(404).json({ err: 'Cannot find record' });
    }

    if (
      record.user.toString() !== req.user.id &&
      req.user.role !== USER_ROLE.ADMIN
    ) {
      return res.status(403).json({ err: 'No permission' });
    }

    const keys = Object.keys(value);
    keys.forEach((key) => {
      record[key] = value[key];
    });

    await record.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ err: 'Server error' });
  }
};

module.exports = controller;
