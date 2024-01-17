const express = require('express')
const router = express.Router()
const {handleEvents,getEvents,addCoordinator} = require('../controllers/eventsController')


//route to get a list of events 
router.get('/',getEvents)


//router to add an event to a user  
router.post('/add/event',handleEvents)


//route to set a coordinator 

router.post('/add/coordinators',addCoordinator)

module.exports = router