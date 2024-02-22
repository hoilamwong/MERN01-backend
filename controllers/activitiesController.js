const User = require('../models/User')
const Activity = require('../models/Activity')
const asyncHandler = require('express-async-handler')

// @desc Get all activities
// @route GET /activities
// @access Private
const getAllActivities = asyncHandler(async (req, res) => {
  const activites = await Activity.find().lean()

  if(!activites?.length){
    return res.status(400).json({ message: 'No Activities found'})
  }

  // Add username to each activity before sending response
  // Not serialized
  // Everything fail if one fail
  const withUser = await Promise.all(activites.map(async (activity) =>{
    const user = await User.findById(activity.user).lean().exec()
    return { ...activity, username: user.username}
  }))

  res.json(withUser)
})

// @desc Get all activities
// @route POST /activities
// @access Private
const createNewActivity = asyncHandler(async (req, res) => {
  const { user, title, tags, timerType, timerStatus, timerDuration} = req.body

  //Confirm data
  if( !user || !title || !tags || tags.length == 0 || !timerType || !timerStatus || !timerDuration ){
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Create and store activity
  const activity = await Activity.create( req.body )

  if(activity){
    return res.status(201).json({ message: "New Activity Created "})
  }else{
    return res.status(400).json({ message:  "Invalid activity data received "})
  }
})

// @desc Update activity
// @route PATCH /activities
// @access Private
const updateActivity = asyncHandler(async (req, res) => {
  return res.status(201).json({  message: 'WIP update activity '})
})

// @desc Delte activity
// @route DELETE /activities
// @access Private
const deleteActivity = asyncHandler(async (req, res) => {
  const { id } = req.body
  
  // Confirm data
  if( !id ){
    res.status(400).json({ message: 'Activity ID required'})
  }

  // Get Activity
  const activity = await Activity.findById(id).exec()

  if(!activity){
    return res.status(400).json({ message: 'Activity Not Found'})
  }

  const result = await activity.deleteOne()

  const reply = `Activity ${result.title} with ID ${result._id} deleted ${result}`

  res.json(reply)
})

module.exports = {
  getAllActivities,
  createNewActivity,
  updateActivity,
  deleteActivity
}