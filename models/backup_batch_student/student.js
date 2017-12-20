const mongoose = require('../config/database')
const { Schema } = mongoose


const evaluationsSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  remark: { type: String },
  color: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'users' }
});


const studentSchema = new Schema({
  name: { type: String, required: true },
  photo: { type: String, default: 'http://via.placeholder.com/500x180?text=No%20Image' },
  evaluations: [evaluationsSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('student', studentSchema)
