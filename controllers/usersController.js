const User = require('../models/User')
const Activity = require('../models/Activity')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean()
  if(!users?.length){
    return res.status(400).json({ message: 'No users found :('})
  }
  res.json(users)
})

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body
  /* Confirm data fields */
  if(!username || !password || !email){
    return res.status(400).json({ message: 'All fields are required :('})
  }

  /* Check for duplicate */ 
  const duplicate = await User.findOne({
    $or: [
      {username},
      {email}
    ]
  }).lean().exec()
  if(duplicate){
    return res.status(409).json({ message: 'Duplicate username and/or email'})
  }

  /* Hash Password */
  const hashedPwd = await bcrypt.hash(password, 10)


  /* Create and Store New User */
  const userObject = { username, "password": hashedPwd, email}
  const user = await User.create(userObject)

  if(user){
    res.status(201).json({ message: `New User ${username} created`})
  }else{
    res.status(400).json({ message: 'Invalid user data received'})
  }
})

const updateUser = asyncHandler(async (req, res, next) => {
  const { id, active, username, password, email } = req.body

  /* Confirm data fields */
  if(!username || !password || !email || typeof active !== 'boolean'){
    return res.status(400).json({ message: 'All fields are required'})
  }

  const user = await User.findById(id).exec()
  if(!user){
    return res.status(400).json({ message: 'User not found'})
  }

  /* Check for duplicate */
  const duplicate = await User.findOne({ username }).lean().exec()
  /* Allow for update */
  if(duplicate && duplicate?._id.toString() !== id){
    return res.status(409).json({ message: 'Duplicate username'})
  }

  user.username = username
  user.email = email
  user.active = active

  /* Hash Password */
  if(passowrd){
    user.password = await bcrypt.hash(password, 10)
  }

  /* Create and Store New User */
  const updatedUser = await user.save()

  res.json({ message: `${updatedUser.username} updated`})
})

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body
  if(!id){
    return res.status(400).json({ message: 'User ID Required'})
  }

  const activity = await Activity.findOne({ user: id }).lean().exec()
  if(activity){
    return res.status(400).json({ message: ' User has assigned activity'})
  }

  const user = await User.findById(id).exec()
  if(!user){
    return res.status(400).json({ message: 'User not found'})
  }

  const result = await user.deleteOne()

  const reply = `User ${result.username} with ID ${result._id} deleted`

  res.json(reply)
})

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser
}