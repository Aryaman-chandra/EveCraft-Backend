const {Events} = require('../models/Events')
const User   = require('../models/Users')
const { default: mongoose } = require('mongoose')


//handling the errors in the events endpoints
const handleErrors = (err)=>{
      const errors = { status : 400,message : '' }
      if(err.message ==='User not found')
      {
         errors.status = 404
         errors.message = err.message
         return errors
      }
      errors.message = err.message
      return errors
}



//function to create an event 
async function handleEvents(req,res)
{

    try{

        var  user = await User.findById(req.body.event_manager)
        if(!user)
        {
          throw Error('User Not found')
        }
         await Events.create({
            "event_manager" :  user._id ,
            "startTime"     :  req.body.startTime,
            "endTime"       :  req.body.endTime,
            "coordinators"  :  req.body?.coordinators,
            "participants"  :  req.body?.participants
        })
        .then((event)=>{
            user.events.push(event._id)
            user.save()
            res.status(201).json({status: "200" , message : 'Event created Succesfully'})
        })
    }
    catch(e)
    {
      error = handleErrors(e) 
     res.status(404).json({"message":error.message})
    }
}
//function to find and return event from events collection 
async function getEvents(req,res)
{
    const id = req.body.id
    try{
         await Events.find({$or:[{event_manager:new mongoose.Types.ObjectId(id)},{coordinators:{$in:[new mongoose.Types.ObjectId(id)]}}]})
        .then((events)=>{
            res.status(200).json({status: 'Found',message :'List of events', Events:events})
        })
    }
    catch(e)
    {
        console.log(e)
        res.send("Cannot find documents")
    }
}
 
const addCoordinator = async (req, res) => {
    try {
      const result = await User.findById(req.body.id);
  
      if (result) {
        const event = await Events.findById(req.body.event);
  
        if (event) {
          // Check if the coordinator already exists in the array

          const existingCoordinator = event.coordinators.find(
            (coordinator) => coordinator.equals(result._id)
          );
  
          if (!existingCoordinator) {
            event.coordinators.push(result);
            await event.save();
            result.events.push(event._id);
            await result.save();
  
            console.log(event);
            res.status(200).json(event);
          } else {
            res.status(400).json({"message":'Coordinator already exists for this event'});
          }
        } else {
          res.status(401).json({"message":'No such event exists'});
        }
      } else {
        res.status(404).json({"message":'User not found'});
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({"message":'Cannot add coordinator'});
    }
  }; 
  async function lookParticipant(req,res)
  {
        const id = req.body.id
        const eventId = req.body.eventId
        try{

          const event = await Events.findById(eventId)
          const participants = event.participants
          const result = participants.id(id)
          if(result)
          {
            res.status(200).json(result)
          }
          else
          res.status(400).json({"message":'Not found'})
        }
        catch(e)
        {
          console.log(e)
          res.status(400).json({"message": e.message})
        }
  }
module.exports = {handleEvents,getEvents,addCoordinator,lookParticipant}