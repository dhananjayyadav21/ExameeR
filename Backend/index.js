const conectToMongo = require('./Db');
const express = require('express');
const cors = require('cors');
const createAdmin = require('./controllers/CreateAdmin');

conectToMongo();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use("/auth", require('./routes/Auth'));
app.use("/content", require('./routes/Content'));

app.listen(port, ()=>{
    createAdmin();
    console.log(`app listening at ${port}`);
});