const express = require('express')
const router = express.Router()
const {handleEvents,getEvents,addCoordinator,lookParticipant} = require('../controllers/eventsController')
const {requireAuth} = require('../middlewares/authMiddleware')

//Event Routes
router.get('/',requireAuth,getEvents)
router.post('/add',requireAuth,handleEvents)
router.post('/coordinators/add',requireAuth,addCoordinator)
router.post('/participants/check',requireAuth,lookParticipant)
module.exports = router