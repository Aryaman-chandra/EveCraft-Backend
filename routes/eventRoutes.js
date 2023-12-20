const express = require('express')
const router = express.Router()
const {handleEvents,getEvents} = require('../controllers/eventsController')


//route to get a list of events 
router.get('/',handleEvents)


//router to add participants to an event 
router.post('/add',getEvents)


//route to set a coordinator 
module.exports = router