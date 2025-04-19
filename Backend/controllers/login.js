const userModel = require('../model/User');
const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const {sendWelcomeEmail} = require("../services/sendEmails")

const login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        if ( !Email || !Password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user already exists
        let user = await userModel.findOne({Email: Email.toLowerCase()});
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Please try to login with right credentials."
            });
        }

        // comapre password
        const isEqualPass = await bcrypt.compare(Password, user.Password);
        if (!isEqualPass) {
            return res.status(400).json({
                success: false,
                message: "Please try to login with right credentials."
            });
        }

        if(!user.isVerified){
            return res.status(400).json({
                success: false,
                message: "Email not veryfied!"
            });
        }

        // create jwt
        const { _id } = user;
            const token = Jwt.sign({_id,Email}, 
                process.env.AUTHTOKEN_SECRATE,
            {
                expiresIn:process.env.JWT_TIMEOUT
            }
        );


        sendWelcomeEmail(user.Email,user.Username);

        user = {
            Email : user.Email
        }

        return res.status(200).json({
            success:true,
            message: 'Successfully login authentication',
            token,
            user
         })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'login server internal error'
        });
    }
};

module.exports = login;
  