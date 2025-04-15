const {outh2client} = require('../utils/googleConfig')
const axios = require('axios');
const Jwt = require('jsonwebtoken');
const userModel = require('../model/User')

const googleLogin = async (req,res)=>{
    try {
       const {code} = req.query;

       const googleRes = await outh2client.getToken(code);
       outh2client.setCredentials(googleRes.tokens);

       const userDataRes = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
       )

       const {email, name, picture} = userDataRes.data;

       console.log("userDataRes==",userDataRes.data);

       let user = await userModel.findOne({Email:email});

       console.log("user==",user);

       if(user){
         console.log("Alrady User Exist");
       }

       if(!user){
          user = await userModel.create({
            Username:name, Email:email,Profile:picture
          })
       }
       
      const { _id } = user;
      const token = Jwt.sign({_id,email}, 
         process.env.AUTHTOKEN_SECRATE,
         {
          expiresIn:process.env.JWT_TIMEOUT
         }
      );
      return res.status(200).json({
         message: 'success',
         token,
         user
      })

    } catch (error) {
        res.status(500).json({
         message: 'googleAuth controller error'
        })
    }
 }
 
 module.exports = googleLogin
 