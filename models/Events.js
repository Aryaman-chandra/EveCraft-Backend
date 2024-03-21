const mongoose = require('mongoose')
const Schema =  mongoose.Schema

const EventsSchema = new Schema({
    event_manager : {
        type : mongoose.Schema.Types.ObjectId,
        ref :  'Users' 
    },
    startTime : String,
    endTime : String,
    coordinators :{ 
      type:[
              {
              type : mongoose.Schema.Types.ObjectId,
              ref : 'Users' ,
              }
          ]
  },
    participants : [
      {
        name : {
            type : String,
            required : true ,
        },
        email : {
            type: String , 
            required : true, 
        },
        isPresent : {
            type : Boolean, 
            default : false,
        },
      },  
    ]
})
var Events = mongoose.model('events',EventsSchema)
module.exports = {Events}
