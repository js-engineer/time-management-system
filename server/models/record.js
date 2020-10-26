const mongoose = require('mongoose');

const { Schema } = mongoose;

const recordSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: { type: Date, required: true },
  notes: { type: [String], required: true },
  hours: { type: Number, required: true },
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
    return Record.find(query).populate('user').sort('-date').lean();
  }
  return Record.find(query)
    .populate('user')
    .sort('-date')
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .lean();
};
Record.getRecordById = (id) => Record.findById(id);
Record.getRecordByUserAndDate = (user, date) => Record.findOne({ user, date });

module.exports = Record;
