const express = require('express')
const router = express.Router()
const {handleEvents,getEvents} = require('../controllers/eventsController')


//route to get a list of events 
router.get('/',getEvents)


//router to add an event to a user  
router.post('/add',handleEvents)


//route to set a coordinator 
module.exports = router