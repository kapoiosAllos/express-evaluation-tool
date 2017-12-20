const mongoose = require('../config/database')
const { Schema } = mongoose


const batchSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'student' },
  name: { type: String, required: true },
  startingAt: { type: Date, default: Date.now, required: true },
  endingAt: { type: Date,required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('batch', batchSchema)
