const jwt = require("jsonwebtoken");
require("dotenv").config();

const AuthToken_Secrate = process.env.AUTHTOKEN_SECRATE;

const fetchUser =  (req, res, next) => {
  try {

    //find token from request header
    let token = req.header("AuthToken");
    if (!token) {
      return res.status(400).json({ 
        success:false,
        message: "Please authenticate with right token" });
    }

    //find id from the token
    const Data =  jwt.verify(token, AuthToken_Secrate);
    req.user = Data;

    console.log(Data);
    next();

  } catch (error) {
    console.error(error.message);
    res.status(500).send("some internal server error to Authenicate User");
  }
};

module.exports = fetchUser;
