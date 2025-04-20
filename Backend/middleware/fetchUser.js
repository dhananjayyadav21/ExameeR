const jwt = require("jsonwebtoken");
require("dotenv").config();

const AuthToken_Secrate = process.env.AUTHTOKEN_SECRATE;

const fetchUser = (req, res, next) => {
  try {

    //find token from request header
    let token = req.header("AuthToken");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please authenticate with right token"
      });
    }

    //find id from the token
    const Data = jwt.verify(token, AuthToken_Secrate);
    req.user = Data;

    console.log(Data);
    next();

  } catch (error) {
    console.error(error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized User"
    });
  }
};

module.exports = fetchUser;
