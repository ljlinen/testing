require('dotenv').config();
const express = require('express');
const app = express();
const webhookrouter = app.Router();

webhookrouter.post('/facebook', (req, res, err) => {
  if(err) {
    console.log(`err at facebook post endpoint ${err}`);
  } else {
    
  }
})

webhookrouter.get('/facebook', async(req, res, err) => {
  if(err) {
    console.log(`err at facebook get endpoint ${err}`);
  } else {
    
    let response = await verification(req);
    req.status(200).send(data.challange);
  }
})



async function verification(req) {
  
  console.log(req.query);
  
  if(req.query === process.env.CHALLENGE) {
    
    return req.body.hub.verify_token;
  } else {
    return 'Challange Did Not Match';
  }
}

async function notification() {
  
}