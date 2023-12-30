const bcrypt = require('bcrypt')
const {Events} = require('../models/Events')
const User   = require('../models/Users')
const { default: mongoose } = require('mongoose')
async function handleEvents(req,res)
{

    try{

        var  user = await User.findById(req.body.event_manager)
        console.log(user._id)
         await Events.create({
            "event_manager" :  user._id ,
            "startTime"     :  req.body.startTime,
            "endTime"       :  req.body.endTime,
            "coordinators"  :  req.body?.Coordinators,
            "participants"  :  req.body?.participants
        })
        .then((event)=>{
            user.events.push(event._id)
            user.save()
            res.status(201).json({status: "Event created succesfully"})
        })
    }
    catch(e)
    {
     console.log(e)
     res.status(404).json(e.message)
    }
}

async function getEvents(req,res)
{
    const id  = req.body.id
    try{
         await Events.find({$or:[{Event_Manager:new mongoose.Types.ObjectId(id)},{Coordinators:{$in:[new mongoose.Types.ObjectId(id)]}}]})
        .then((events)=>{
            res.status(200).json({status: 'Events found',Events:events})
        })
    }
    catch(e)
    {
        console.log(e)
     res.send("Cannot find documents")
    }
}
 

 
module.exports = {handleEvents,getEvents}