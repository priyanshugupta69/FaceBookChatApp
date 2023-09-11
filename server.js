import express from 'express'; // Use `import` instead of `require`
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});
import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import passportAuth from './facebook_auth/passportAuth.js';
import dbConnect from './db/dbsetup.js';
import axios from 'axios';
dbConnect();

import session from 'express-session';
app.use(session({
    secret: 'your_secret_key', // Change this to a random string
    resave: true,
    saveUninitialized: true
  }));


const fbId = process.env.facebook_app_id;
const fbSecret = process.env.facebook_app_secret;

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());



// io.on("connection", (socket) => {
//     // ...
// });


app.post("/webhook", (req, res) => {
    let body = req.body;
  
    console.log(`\u{1F7EA} Received webhook:`);
    console.dir(body, { depth: null });
    if (body.object === "page") {
        // Returns a '200 OK' response to all requests
        res.status(200).send("EVENT_RECEIVED");
    
        // Determine which webhooks were triggered and get sender PSIDs and locale, message content and more.
      } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
      }
});

app.get("/webhook", (req, res) => {
  
    // Parse the query params
      let mode = req.query["hub.mode"];
      let token = req.query["hub.verify_token"];
      let challenge = req.query["hub.challenge"];
    
      // Check if a token and mode is in the query string of the request
      if (mode && token) {
        // Check the mode and token sent is correct
        if (mode === "subscribe" && token === process.env.verify_token){
          // Respond with the challenge token from the request
          console.log("WEBHOOK_VERIFIED");
          res.status(200).send(challenge);
        } else {
          // Respond with '403 Forbidden' if verify tokens do not match
          res.sendStatus(403);
        }
      }
    });

app.get('/getPages', (req, res) => {
    const url = `https://graph.facebook.com/v11.0/me/accounts?access_token=${req.user.accessToken}`;
    axios.get(url)
    .then(response => {
        console.log(response.data);
        let pages = [];
        for(let i = 0; i < response.data.data.length; i++){
            pages.push(response.data.data[i].name);
        }
        res.json(pages);
    })
    .catch(error => {
        console.log(error);
    });
});



//---------------------------facebook auth routes--------------------------------------
app.get('/auth/facebook',
  passport.authenticate('facebook')
);
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/getPages');
  });


//-----------------------------------------serverRunning-------------------------------------------
httpServer.listen(4000 , ()=>{
    console.log("Server is running on port 4000");
});
