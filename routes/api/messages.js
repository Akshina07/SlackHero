const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();
// const slackSigningSecret = require('./config/keys').SLACK_SIGNING_SECRET;
const token = require('../../config/keys').SLACK_BOT_TOKEN;
var fs = require('fs'); 
const keys = require('../../config/keys');
const verify = require('../../utilities/verify-token');
const Message = require('../../models/Message');
const Conversation = require('../../models/Conversation');
const GlobalMessage = require('../../models/GlobalMessage');
const slacktoken= require("../../config/keys").SLACK_USER_TOKEN;
const bottoken = require("../../config/keys").SLACK_BOT_TOKEN;
const User = require('../../models/User');
const Room = require('../../models/Room');
const yahoo = require('yahoo-finance');
let lastClientId;
let botFlag=false;

let jwtUser = null;
let conversationsStore = {};

//Modules to get list of Slack Channels
async function fetchConversations(req) {
    try {
      // Call the conversations.list method using the built-in WebClient
      const result = await req.sapp.client.conversations.list({
        // The token you used to initialize your app
        token: token
      });
  
      saveConversations(result.channels);
      // console.log(result['channels']);
    }
    catch (error) {
      console.error(error);
    }
  }
  
  // Put conversations into the JavaScript object
  function saveConversations(conversationsArray) {
    let conversationId = '';
    conversationsArray.forEach(function(conversation){
      // Key conversation info on its unique ID
      conversationId = conversation["name"];
      
      // Store the entire conversation object (you may not need all of the info)
      conversationsStore[conversationId] = conversation;
    });
    console.log(conversationsStore);
  }
  
  function createNewChannel(name_,req){
    try {
      // Call the conversations.create method using the built-in WebClient
      const result = req.sapp.client.conversations.create({
        // The token you used to initialize your app is stored in the `context` object
        token: bottoken,
        // The name of the conversation
        name: name_,
        // Add the user who clicked the message action into the new channel 
        // user_ids: payload.user
      });
    }
    catch(error){
      console.log(error);
    }
  }


// Token verfication middleware
router.use(function(req, res, next) {
    try {
        jwtUser = jwt.verify(verify(req), keys.secretOrKey);
        next();
    } catch (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Unauthorized' }));
        res.sendStatus(401);
    }
});

// Get global messages
router.get('/global', (req, res) => {
    console.log(req);
    console.log("Get a message");
    GlobalMessage.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
    ])
        .project({
            'fromObj.password': 0,
            'fromObj.__v': 0,
            'fromObj.date': 0,
        })
        .exec((err, messages) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                // console.log("Messages ");
                res.send(messages);
            }
        });
});


// Post global message
router.post('/global', (req, res) => {
    console.log("Posted a message");
  
    let message = new GlobalMessage({
        from: jwtUser.id,
        body: req.body.body,
    });

    // console.log(req.body.body);
    User.findById(mongoose.Types.ObjectId(jwtUser.id)).then( user => {
        const from = user.name;
        console.log(user.name+from);
        // req.sapp.client.chat.postMessage({ token: token, channel: 'general', text: 'Hello everyone'});
        if(req.body.body[0]=="/"){
            if(req.body.body=="/eto"){
                // console.log("Correct");
                req.io.sockets.emit('bot', "https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg");
                const message=[
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Hi "+from+"!" 
                        }
                    },
                    {
                        "type": "section",
                        "text":{
                        
                                "type": "mrkdwn",
                                "text": "Great to see you! SlackHero-ETO helps you to stay up-to date with Goldman Sachs Stock Prices!"
                            }
                        
                    },
                    {
                        "type": "image",
                        "title": {
                          "type": "plain_text",
                          "text": "GS Stock Price"
                        },
                        "block_id": "image4",
                        "image_url": "https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg",
                        "alt_text": "GS Stock Price"
                      }
                ]
                req.sapp.client.chat.postMessage({token: bottoken, channel: 'globalchat', blocks: message, username: from});

            }
            
            
            
        }else{
            req.io.sockets.emit('messages', req.body.body);
            req.sapp.client.chat.postMessage({token: bottoken, channel: 'globalchat', text: req.body.body,username: from});
        }
        
    });
    
    
    message.save(err => {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Failure' }));
            res.sendStatus(500);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Success' }));
        }
    });

});

// router.post('/room', (req, res) => {
//     let message = new RoomMessage({
//         from: jwtUser.id,
//         body: req.body.body,
//     });

//     req.io.sockets.emit('messages', req.body.body);

//     message.save(err => {
//         if (err) {
//             console.log(err);
//             res.setHeader('Content-Type', 'application/json');
//             res.end(JSON.stringify({ message: 'Failure' }));
//             res.sendStatus(500);
//         } else {
//             res.setHeader('Content-Type', 'application/json');
//             res.end(JSON.stringify({ message: 'Success' }));
//         }
//     });
// });

// Get conversations list
router.get('/conversations', (req, res) => {
    let from = mongoose.Types.ObjectId(jwtUser.id);
    Conversation.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'recipients',
                foreignField: '_id',
                as: 'recipientObj',
            },
        },
    ])
        .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
        .project({
            'recipientObj.password': 0,
            'recipientObj.__v': 0,
            'recipientObj.date': 0,
        })
        .exec((err, conversations) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                res.send(conversations);
            }
        });
});

// Get messages from conversation
// based on to & from
router.get('/conversations/query', (req, res) => {
    let user1 = mongoose.Types.ObjectId(jwtUser.id);
    let user2 = mongoose.Types.ObjectId(req.query.userId);

    // console.log(user1);
    Message.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'to',
                foreignField: '_id',
                as: 'toObj',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
    ])
        .match({
            $or: [
                { $and: [{ to: user1 }, { from: user2 }] },
                { $and: [{ to: user2 }, { from: user1 }] },
            ],
        })
        .project({
            'toObj.password': 0,
            'toObj.__v': 0,
            'toObj.date': 0,
            'fromObj.password': 0,
            'fromObj.__v': 0,
            'fromObj.date': 0,
        })
        .exec((err, messages) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                res.send(messages);
            }
        });
});

// Post private message
router.post('/', (req, res) => {
    // console.log("Private message");
    let from = mongoose.Types.ObjectId(jwtUser.id);
    let to = mongoose.Types.ObjectId(req.body.to);

    Conversation.findOneAndUpdate(
        {
            recipients: {
                $all: [
                    { $elemMatch: { $eq: from } },
                    { $elemMatch: { $eq: to } },
                ],
            },
        },
        {
            recipients: [jwtUser.id, req.body.to],
            lastMessage: req.body.body,
            date: Date.now(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function(err, conversation) {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                let message = new Message({
                    conversation: conversation._id,
                    to: req.body.to,
                    from: jwtUser.id,
                    body: req.body.body,
                });

                User.findById(from).then( user1_ => {
                    const from_u = user1_.name;
                    User.findById(to).then( user2_ => {
                        const to_u = user2_.name;
                        const User_id=user2_.slack_id;
                        // console.log(User_id);
                        req.io.sockets.emit('messages', req.body.body);
                        req.sapp.client.chat.postMessage({token: bottoken, channel: User_id, text: req.body.body,username: from_u});
                       
                    });
                   
                });
                
                
               
                message.save(err => {
                    if (err) {
                        console.log(err);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'Failure' }));
                        res.sendStatus(500);
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(
                            JSON.stringify({
                                message: 'Success',
                                conversationId: conversation._id,
                            })
                        );
                    }
                });
            }
        }
    );
});

//Get bot conversations 
router.get('/bot', (req, res) => {
    console.log("Get a message");
    GlobalMessage.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
    ])
        .project({
            'fromObj.password': 0,
            'fromObj.__v': 0,
            'fromObj.date': 0,
        })
        .exec((err, messages) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                // console.log(messages);
                res.send(messages);
            }
        });
});


// Post a bot response
router.post('/bot', (req,res) => {
     
    // console.log(req.body.body);
    User.findOne({name:"bot"}).then( user => {
        const from = user.name;
        var response_text;
        console.log(user.name+from);
    
            if(req.body.body=="/stock"){
                // console.log("Correct");
                response_text="Hi "+from+"!\n"+"Great to see you! SlackHero-ETO helps you to stay up-to date with Goldman Sachs Stock Prices!" ;
                let data = "https://gsimageakshina.s3.amazonaws.com/GS_YahooFinanceChart.png";
                fs.readFile("gs.png",function(err,buf){
                    req.io.sockets.emit('bot',{image:true, buffer :buf.toString('base64') });
                })
                
                const message=[
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Hi "+from+"!" 
                        }
                    },
                    {
                        "type": "section",
                        "text":{
                        
                                "type": "mrkdwn",
                                "text": "Great to see you! SlackHero-ETO helps you to stay up-to date with Goldman Sachs Stock Prices!"
                            }
                        
                    },
                    {
                        "type": "image",
                        "title": {
                          "type": "plain_text",
                          "text": "GS Stock Price"
                        },
                        "block_id": "image4",
                        "image_url": data,
                        "alt_text": "GS Stock Price"
                      }
                ]
                req.sapp.client.chat.postMessage({token: bottoken, channel: 'globalchat', blocks: message, username: from});

            }
            console.log(response_text);
            // var final_data=`${req.body.body}\n ${response_text}`
            let message = new GlobalMessage({
                from: user.id,
                body: String(response_text),
            });

            // response.save();
            message.save(err => {
                if (err) {
                    console.log(err);
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'Failure' }));
                    res.sendStatus(500);
                } else {
                
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'Success' }));
                }
    });
            
        
    });
    

})

// Create a new room on Slack
router.post('/createRoom', (req,res) => {
    // fetchConversations(req);
    console.log(req.body.body);

    
        console.log("Inside Try");
        const result = req.sapp.client.conversations.create({
          // The token you used to initialize your app is stored in the `context` object
          token: bottoken,
          name: req.body.body
        }).catch(err => {
            console.log(err);
            // res.sendStatus(500);
            
        })
        .then(()=>{
            // fetchConversations(req);
            // console.log(conversationsStore[req.body.body]);
            let newRoom = new Room({
                name: req.body.body,
                slack_channel: req.body.body
            });

            newRoom.save();
    
            res.send(JSON.stringify({ message: 'Success' }));
        });
});

module.exports = router;
