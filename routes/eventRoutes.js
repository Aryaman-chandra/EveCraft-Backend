const express = require('express')
const router = express.Router()
const {handleEvents,getEvents,addCoordinator,lookParticipant} = require('../controllers/eventsController')
const {requireAuth} = require('../middlewares/authMiddleware')

//route to get a list of events 
router.get('/',requireAuth,getEvents)

//router to add an event to a user  
router.post('/add',handleEvents)


//route to set a coordinator 

router.post('/coordinators/add',addCoordinator)

//route to check for authentication of a attendant 

router.post('/participants/check',lookParticipant)
module.exports = router