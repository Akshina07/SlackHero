const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');
const Token = require("../../models/Token");
const slacktoken= require("../../config/keys").SLACK_USER_TOKEN;
const bottoken = require("../../config/keys").SLACK_BOT_TOKEN;
// const UserApp = require("../../utilities/slack");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const verify = require('../../utilities/verify-token');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const User = require('../../models/User');


// Sign in Slack and Add to Slack Button Route 
router.get('/oauth/v2/authorize', function(req, res){
    if (!req.query.code) { // access denied
      console.log('Access denied');
      return;
    }

    console.log(req);
    // console.log(`${data.client_id}`);
    // console.log("https://slack.com/api/oauth.access"+`?client_id=1152893118226.1175441945780?client_secret=8dfe6aaecdd799f6329c62d78cf6c9dc?code=${req.query.code}`);
    request.post("https://slack.com/api/oauth.v2.access"+"?code="+req.query.code+"&client_id=1152893118226.1175441945780"+"&client_secret=8dfe6aaecdd799f6329c62d78cf6c9dc", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        
        // Get an auth token (and store the team_id / token)
        
        let response = JSON.parse(body);
        // console.log(response);
        const newToken = new Token({
            app_id: response.app_id,
            authed_user_id: response.authed_user.id,
            scope: response.scope,
            token_type: response.token_type,
            acess_token: response.acess_token,
            bot_user_id: response.bot_user_id,
            team: response.team,
            incoming_webhook: response.incoming_webhook
            
        });

        newToken.save(err => {
            if (err) {
                console.log(err);
            } else {
               console.log('Successful');
            }
        });
        
        
        // storage.setItemSync(JSON.parse(body).team_id, JSON.parse(body).access_token);
        // let auth_user=response.authed_user;
        // console.log(response.authed_user.token_type);
        if(response.token_type!=undefined && response.token_type=="bot"){
            res.redirect("http://localhost:3000/chat");
        }
        else if(response.authed_user.token_type=="user"){
            // req.sapp.client.chat.postMessage({token: slacktoken, channel: 'pretend-channel', text: "Welcome to Slack Intergration Project",username: "Akshina"});
            
            (async() => {
                try {
                    // Call the users.info method using the built-in WebClient
                    const result = await req.sapp.client.users.info({
                      // The token you used to initialize your app is stored in the `context` object
                      token: bottoken,
                      // Call users.info for the user that joined the workspace
                      user: response.authed_user.id
                    });

                    // console.log(verify(req));
                    // const user_info = JSON.parse(result);
                    let username_= result.user.real_name;
                    console.log(username_);
                    // Find user by username

                    User.findOne({username: username_}).then(user => {
                        // Check if user exists
                        if (!user) { // User does not exists , register
                            console.log("User does not exists");
                            
                            const newUser = new User({
                                name: result.user.real_name,
                                username: result.user.real_name,
                                password: result.user.real_name,
                                slack_id: result.user.id
                            });

                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(newUser.password, salt, (err, hash) => {
                                    if (err) throw err;
                                    newUser.password = hash;
                                    newUser
                                        .save()
                                        .then(user => {
                                            const payload = {
                                                id: user.id,
                                                name: user.name,
                                            };
                                            // Sign token
                                            jwt.sign(
                                                payload,
                                                keys.secretOrKey,
                                                {
                                                    expiresIn: 31556926, // 1 year in seconds
                                                },
                                                (err, token) => {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        req.io.sockets.emit(
                                                            'users',
                                                            user.username
                                                        );
                                                        res.json({
                                                            success: true,
                                                            token: 'Bearer ' + token,
                                                            name: user.name,
                                                        });
                                                    }
                                                }
                                            );
                                        })
                                        .catch(err => console.log(err));
                                });
                            });
                        }
                        else{
                            // Check password
                        User.findOneAndUpdate({username:username_},{$set: {slack_id:result.user.id}});
                        bcrypt.compare(username_, user.password).then(isMatch => {
                            if (isMatch) {
                                // User matched
                                // Create JWT Payload
                                const payload = {
                                    id: user.id,
                                    name: user.name,
                                };
                                // Sign token
                                jwt.sign(
                                    payload,
                                    keys.secretOrKey,
                                    {
                                        expiresIn: 31556926, // 1 year in seconds
                                    },
                                    (err, token) => {
                                        res.json({
                                            success: true,
                                            token: 'Bearer ' + token,
                                            name: user.name,
                                            username: user.username,
                                        });
                                    }
                                );
                                // req.io.sockets.emit('messages', req.body.body);
                                // req.sapp.client.chat.postMessage({ token: token, channel: 'general', text: 'Welcome to Slack Integration Project!'});
                
                            } else {
                                return res
                                    .status(400)
                                    .json({ passwordincorrect: 'Password incorrect' });
                            }
                        });
                    }
                        
                });
                
                // console.log(result);
                  }
                  catch (error) {
                    console.error(error);
                  }
            })();
            
            
        //     const user_ = req.sapp.client.users.info({
        //        token: slacktoken,
        //        user: response.authed_user.id

        //    });
        //    console.log(user_); 
        res.redirect("http://localhost:3000/chat"); // will be redirected to client side !

        }
      }
    })
  });


  module.exports = router;
