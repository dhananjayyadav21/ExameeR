const {outh2client} = require('../utils/googleConfig')
const axios = require('axios');
const Jwt = require('jsonwebtoken');
const userModel = require('../model/User')
async function getImageAsBase64(url) {
   try {
   const response = await fetch(url);
   const arrayBuffer = await response.arrayBuffer();
   const buffer = Buffer.from(arrayBuffer);
   const mimeType = response.headers.get('content-type');
   const base64 = buffer.toString('base64');
   const base64Image = `data:${mimeType};base64,${base64}`;
   return base64Image;
   } catch (err) {
   console.error('Failed to fetch image:', err.message);
   }
}

const googleLogin = async (req,res)=>{
    try {
       const {code} = req.query;

       const googleRes = await outh2client.getToken(code);
       outh2client.setCredentials(googleRes.tokens);

       const userDataRes = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
       )

       const {email, name, picture} = userDataRes.data;

       let user = await userModel.findOne({Email:email});
       if(user){
         console.log("Already User Exist");
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

      // Make sure you're running Node.js v18+ for built-in fetch
      user.Profile = await getImageAsBase64(user.Profile);
      return res.status(200).json({
         success:true,
         message: 'Successfully google authentication',
         token,
         user
      })

    } catch (error) {
        res.status(500).json({
         success:false,
         message: 'googleAuth controller error'
        })
    }
 }
 
 
 module.exports = googleLogin
 