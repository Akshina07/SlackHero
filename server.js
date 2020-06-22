
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const { App } = require('@slack/bolt');
const slackSigningSecret = require('./config/keys').SLACK_SIGNING_SECRET;
const token = require('./config/keys').SLACK_BOT_TOKEN;
const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(slackSigningSecret);
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
require('babel-polyfill');
const fs = require('fs');
// const path = require('path');

let lastClientId;
let lastTS;
const users = require('./routes/api/users');
const messages = require('./routes/api/messages');
const oauth = require('./routes/api/oauth');
const slackbot= require("./routes/api/slashbot");
const User = require('./models/User');
const GlobalMessage = require('./models/GlobalMessage');

app.use(express.static('client/build'));
app.get('*', (req, res) => {
res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});
// const sapp = require('./utilities/slack');
// const router = require('./router');

const app = express();

//Slack App config 
const sapp = new App({
    token: token,
    signingSecret: slackSigningSecret
  });
  

const server= http.Server(app);
// Port that the webserver listens to
const port = 5000;

// // Slack Events MiddleWare
app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/slack/events', slackEvents.expressMiddleware());
app.use(cors());

// Body Parser middleware to parse request bodies
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());
  
const io = socketio(server);

// // Database configuration
// const db = require('./config/keys').mongoURI;
// const db="https:"
mongoose
    .connect('mongodb://127.0.0.1:27017/db', { useNewUrlParser: true, useFindAndModify: false })
    .then(() => console.log('MongoDB Successfully Connected'))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require('./config/passport')(passport);

// // Assign socket object to every request
app.use(function(req, res, next) {
    req.io = io;
    req.sapp=sapp;
    req.slackEvents=slackEvents;
    next();
});

// Routes
app.use('/api/users', users);
app.use(oauth);
app.use('/api/messages', messages);
app.use(slackbot);


io.on("connection",function(socket){
    // console.log(socket);
    const botUser = new User({
        name: "bot",
        username: "bot",
        password: "bot"
    
    });
    
    User.findOne({name:"bot"}).then( user=>{
        if(!user){
            botUser.save();
        }
        else{
            console.log(user.id);
        }
    });
    (async() =>{ 
        await slackEvents.on('message', (event) => {
            
            // console.log(event.subtype);
            // if(event.client_msg_id != lastClientId)
            if(event.text && event.text[0]=="/"){
                
                if(event.ts != lastTS){
                    console.log(`in Received a message event: in channel `);
                    // socket.emit('bot', "https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg");
                    User.findOne({name:"bot"}).then( user => {
                        const from = user.name;
                        var response_text;
                        console.log(user.name+from);
                    
                            if(event.text=="/stock"){
                                console.log("Correct");
                                response_text="Hi "+from+"!\n"+"Great to see you! SlackHero-ETO helps you to stay up-to date with Goldman Sachs Stock Prices!" ;
                                fs.readFile("gs.png",function(err,buf){
                                    console.log("Read file");
                                    socket.emit('bot',{image:true, buffer :buf.toString('base64') });
                                })
                                // let data = "https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg";
                                
                                // socket.emit('bot',data);
                            }
                            //console.log(response_text);
                            //var final_data=`${req.body.body}\n ${response_text}`
                            let message = new GlobalMessage({
                                from: user.id,
                                body: String(response_text),
                            });
                
                            message.save();
                            // message.save(err => {
                            //     if (err) {
                            //         console.log(err);
                            //         res.setHeader('Content-Type', 'application/json');
                            //         res.end(JSON.stringify({ message: 'Failure' }));
                            //         res.sendStatus(500);
                            //     } else {
                                
                            //         res.setHeader('Content-Type', 'application/json');
                            //         res.end(JSON.stringify({ message: 'Success' }));
                            //     }
                            //  });
                            
                        
                    });
                    lastTS=event.ts;
                }
                
            }
            else if(event.subtype==undefined){
                // socket.emit('fromslack', "SLACK:"+JSON.stringify(event.blocks));
                // botFlag=true;
                // if(event.subtype=="bot_message")
                //     return;
                if(event.client_msg_id != lastClientId){
                    // botFlag=true;
                    if( `${event.user}` != 'U014Z7QCVUJ'){
                        User.findOne({slack_id:event.user}).then( user => {
                            console.log(`in Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
                            console.log(user.username);
                            socket.emit('messages', event.text);

                            let message = new GlobalMessage({
                                from: user.id,
                                body: event.text,
                            });
                
                            message.save();

                        });
                
                            
                        // socket.emit('Slackmessages', event.text);
                        //   console.log(req.io.sockets)
                    }
                    lastClientId=event.client_msg_id;
                }
            }
        }); 
        
    })();
});



// (async() =>{ 
//     await slackEvents.on('message', (event) => {
//     console.log('can listen');
//     console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
    
//   });
// })();





(async()=>{
  await server.listen(port, () => console.log(`Server has started.`));
})();

