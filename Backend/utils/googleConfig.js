const {google} = require("googleapis");

GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
GOOGLE_CLIENT_SECRATE = process.env.GOOGLE_CLIENT_SECRATE;

exports.outh2client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRATE,
    "postmessage"
)