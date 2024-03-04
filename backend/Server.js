require('dotenv').config();
const routerhome = require('./router/homerouter.js');
const express = require('express');
const app = express();

app.use('/home', routerhome);

app.listen(process.env.SERVERPORT, (err, res) => {
    console.log(`running on port ${process.env.SERVERPORT}`)
});