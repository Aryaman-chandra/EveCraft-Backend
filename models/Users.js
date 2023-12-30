const mongoose = require('mongoose')

const bcrypt = require('bcrypt')
const Schema = mongoose.Schema


//User Schema for the App 
const UserSchema = new Schema({
    username : {
        type : String,
        unique : false,
        sparse : true,
    },
    email : {
        type:  String,
        required : true,
        unique: true,
    },
    hashedPassword : {
        type : String,
        required : true, 
    },
    events : {
        type : [
            {
             type : mongoose.Schema.Types.ObjectId,
             ref : 'Events'   
            }
        ]
    }

})


  var User= mongoose.model('user', UserSchema);
  module.exports = User;