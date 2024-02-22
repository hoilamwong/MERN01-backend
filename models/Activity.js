const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  tags: [{
    type: String,
    required: true
  }],
  timerType: { type: String, required: true },
  timerStatus: { type: String, required: true }, // default | running | paused | completed | 
  timerDuration: { type: Number, required: true }, // default 25 min ( 25 * 60 s *1000 ms)
  timerStarted: { type: String },
  timerEnd: { type: Date },
})

module.exports = mongoose.model('Activity', activitySchema)