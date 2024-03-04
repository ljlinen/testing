const { google } = require('googleapis');
const nodemailer = require('nodemailer');
//const addMessages = require('../facebook/fromInbox.js');
const readline = require('readline')
const fs = require('fs');
const TOKEN_PATH = 'tojen.json'

let YOUR_CLIENT_ID = '';
let YOUR_CLIENT_SECRET = '';
const YOUR_REFRESH_TOKEN = '';

// fs.readFile('./oauth2.keys.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   const authContent = JSON.parse(content).web

//   YOUR_CLIENT_ID = authContent.client_id;
//   YOUR_CLIENT_SECRET = authContent.client_secret;

// });


// Load client secrets from a local file.
fs.readFile('./oauth2.keys.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.

  authorize(JSON.parse(content), sendMessage);
});

function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile('token.json', (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
}

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://mail.google.com/'],
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile('token.json', JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function sendMessage(auth) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'FastFiveSquad@gmail.com',
      clientId: auth.credentials.client_id,
      clientSecret: auth.credentials.clientSecret,
      refreshToken: 'YOUR_REFRESH_TOKEN',
      accessToken: auth.credentials.access_token,
    },
  });

  const mailOptions = {
    from: 'FastFiveSquad@gmail.com',
    to: ['Siphomoloto0@gmail.com', 'llmolototnp@gmail.com'],
    subject: 'Sending Email using Node.js Gmail API',
    text: 'This is a test email sent using Node.js and Gmail API!',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error occurred while sending email:', error);
    }
    console.log('Email sent:', info.response);
  });
}