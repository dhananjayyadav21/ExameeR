const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Username:{
        type:String,
        required:true,

    },
    Email:{
        type:String,
        required:true,
        unique:true

    },
    Password:{
        type:String,
        required:true,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    VerificationCode:{
        type:String
    },
    Profile:{
        type:String 
    }
  
});

module.exports = mongoose.model('Users',UserSchema);
