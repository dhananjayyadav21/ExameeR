const conectToMongo = require('./Db');
const express = require('express');
const cors = require('cors')

conectToMongo();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use("/auth", require('./routes/Auth'));

app.listen(port, ()=>{
    console.log(`app listening at ${port}`);
});