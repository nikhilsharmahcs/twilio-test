const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors')
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
// require('dotenv').config();

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = 'AC9e8e0d9a89ffc9d1550461d690f1a1f2';
const twilioApiKeySID = 'SKcd06e29637ba5ee4993ed98afa453adf';
const twilioApiKeySecret = 'uoeHj2e2BHhUxYpTTe78kkA2GwhVWAut';

// app.use(express.static(path.join(__dirname, 'build')));
app.use(cors())
app.get('/token', (req, res) => {
  const { identity, roomName } = req.query;
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  token.identity = identity;
  console.log(token)
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);
  res.send(token.toJwt());
  console.log(`issued token for ${identity} in room ${roomName}`);
});

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

app.listen(8081, () => console.log('token server running on 8081'));
