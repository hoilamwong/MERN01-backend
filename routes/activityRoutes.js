const express = require('express')
const router = express.Router ()

const activitiesController = require('../controllers/activitiesController')

router.route('/')
  .get(activitiesController.getAllActivities)
  .post(activitiesController.createNewActivity)
  .patch(activitiesController.updateActivity)
  .delete(activitiesController.deleteActivity)

module.exports = router