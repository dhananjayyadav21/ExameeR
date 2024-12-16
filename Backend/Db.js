const mongoose = require('mongoose');
require('dotenv').config();

const mongodbUri = process.env.DB_URI;

const conectToMongo = ()=>{
    mongoose.connect(mongodbUri)
    .then(() => console.log('Connected!'));
}

module.exports = conectToMongo;