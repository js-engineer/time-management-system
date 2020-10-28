const mongoose = require('mongoose');

const { Schema } = mongoose;

const recordSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: { type: Date, required: true },
  notes: { type: [{ text: String, hours: Number }], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Record = mongoose.model('Record', recordSchema);
Record.createRecord = async (data) => {
  const newRecord = await Record(data).save();
  return newRecord;
};

Record.countRecords = (query) => Record.countDocuments(query);

Record.listRecords = (query, pageNum, pageSize) => {
  if (pageSize === -1) {
    return Record.find(query)
      .select('-__v -notes._id')
      .populate('user', '-password -__v')
      .sort('-date')

      .lean();
  }
  return Record.find(query)
    .select('-__v -notes._id')
    .populate('user', '-password -__v')
    .sort('-date')
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .lean();
};
Record.getRecordById = (id) =>
  Record.findById(id)
    .select('-__v -notes._id')
    .populate('user', '-password -__v');

Record.getRecordByUserAndDate = (user, date) =>
  Record.findOne({ user, date })
    .select('-__v -notes._id')
    .populate('user', '-password -__v');

module.exports = Record;
