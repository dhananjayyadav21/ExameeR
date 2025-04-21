const userModel = require('../model/User');
const Jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { sendVerificationEamil } = require("../services/sendEmails");
require("dotenv").config();

const createAdmin = async (req, res, next) => {
  try {

    let adminUser = await userModel.findOne({ Username:"admin" });

    if(!adminUser){

        // Hash password
        const password = "Examee.admin@iit";
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password.toString(), salt);

        // create verification code
        const VerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // create ExmeeUserIdBasedOnEmail for uniq id
        function userIdBasedOnEmail(userEmail) { 
        const hash = [...userEmail].reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return hash + Math.floor(Math.random() * 10000);
        }  
        const ExmeeUserIdBasedOnEmail = userIdBasedOnEmail("youaretopperofficial@gmail.com");
        const ExmeeUserId = Jwt.sign(ExmeeUserIdBasedOnEmail, process.env.ExameeUserId_SECRATE)

        adminUser = new userModel({ // create user
            Username:"admin",
            Email: "youaretopperofficial@gmail.com",
            Password: securePassword,
            Role:"Admin",
            ExmeeUserId:ExmeeUserId,
            VerificationCode,  
        });
        sendVerificationEamil("youaretopperofficial@gmail.com", VerificationCode); // send verification code
        await adminUser.save();
    }
    next();
  } catch (error) {
    console.error(error.message);
    console.log("Error accured during the creating admin user");
  }
};

module.exports = createAdmin;
