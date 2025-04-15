const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Username:{
        type:String
    },
    Email:{
        type:String
    },
    Password:{
        type:String
    },
    VerificationCode:{
        type:Number
    },
    Profile:{
        type:String 
    }
  
});

module.exports = mongoose.model('Users',UserSchema);
