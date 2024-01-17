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
         await Events.find({$or:[{event_manager:new mongoose.Types.ObjectId(id)},{coordinators:{$in:[new mongoose.Types.ObjectId(id)]}}]})
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
            res.status(400).json('Coordinator already exists for this event');
          }
        } else {
          res.status(401).json('No such event exists');
        }
      } else {
        res.status(404).json('User not found');
      }
    } catch (e) {
      console.error(e);
      res.status(500).json('Cannot add coordinator');
    }
  }; 
module.exports = {handleEvents,getEvents,addCoordinator}