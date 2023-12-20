const bcrypt = require('bcrypt')
const {Events} = require('../models/Events')
const {ObjectId} = require('mongodb')
async function getEvents(req,res)
{

    try{
        console.log(req.body.Event_Manager)
        await Events.create({
            "Event_Manager" :  ObjectId(req.body.Event_Manager) ,
            "startTime"     :  req.body.startTime,
            "endTime"       :  req.body.endTime,
            "Coordinators"  :  req.body?.Coordinators,
            "participants"  :  req.body?.participants
        })
        .then(()=>{
            res.status(201).json({status: "Event created succesfully"})
        })
    }
    catch(e)
    {
     console.log(e)
     res.send(e)
    }
}
async function handleEvents(req,res)
{
    var id  = req.body.id
    try{
         await Events.find({$or:[{Event_Manager:id},{Coordinators:{$in:[id]}}]})
        .then((events)=>{
            res.status(200).json({status: 'Events found',Events:events})
        })
    }
    catch(e)
    {
     res.send("Cannot find documents")
    }
}



module.exports = {handleEvents,getEvents}