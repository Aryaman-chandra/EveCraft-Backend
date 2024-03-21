const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const {isEmail} = require('validator')
const crypto = require('crypto')
//User Schema for the App 
const UserSchema = new Schema({
    username : {
        type : String,
        unique : false,
        sparse : true,
    },
    email : {
        type:  String,
        required : [true,'Please enter a  e-mail'],
        unique : true,
        validate : [isEmail,'Please enter a valid Email']   
    },
    password : {
        type : String,
        required : [true,'Please enter a password'], 
        minlength :[8,'Minimum Password is 8 characters']
        //The minlength constraint won't work as the bcrypt already hashes the password before it is stored
        //Might use mongoose hooks for that later 
        //Not right now 
        //Worry not this has been dealt with by using pre save method below
    },
    events : {
        type : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Events'   
            }
        ]
    },
    passwordResetToken : {
        type : String,
    },
    passwordResetTokenExpires : {
        type : Date
    }
})
//Hashes the Password before saving to the database using mongoose pre function 
UserSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 8 , null);
    next();
  });
UserSchema.methods.createToken =    function(){ 
    const resetToken = crypto.randomBytes(32).toString('hex'); 
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now()+ 10*60*1000;
    console.log(resetToken,this.passwordResetToken);
    return resetToken;
}
  
  var User= mongoose.model('user', UserSchema);
  module.exports = User;
