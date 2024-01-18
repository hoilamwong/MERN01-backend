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
    required: true
  },
  },{
    timestamps: true
  }
)

module.exports = mongoose.model('Activity', activitySchema)