const mongoose = require('../config/database')
const { Schema } = mongoose
const students = require('./student').schema


const batchSchema = new Schema({
  studentId: [{ type: Schema.Types.ObjectId, ref: 'students' }],
  name: { type: String, required: true },
  startingAt: { type: Date, default: Date.now, required: true },
  endingAt: { type: Date,required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('batch', batchSchema)
