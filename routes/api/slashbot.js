const express = require('express');
const slacktoken= require("../../config/keys").SLACK_USER_TOKEN;
const bottoken = require("../../config/keys").SLACK_BOT_TOKEN;
const router = express.Router();
const bodyParser = require('body-parser');
var request = require('request');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// router.post('/slack/command/report', async (req, res) => {
//   try {
//     const slackReqObj = req.body;
//     const response = {
//       response_type: 'in_channel',
//       channel: slackReqObj.channel_id,
//       text: 'Hello :slightly_smiling_face:',
//       attachments: [{
//         text: 'What report would you like to get?',
//         fallback: 'What report would you like to get?',
//         color: '#2c963f',
//         attachment_type: 'default',
//         callback_id: 'report_selection',
//         actions: [{
//           name: 'reports_select_menu',
//           text: 'Choose a report...',
//           type: 'select',
//         //   options: reportsList,
//         }],
//       }],
//     };
//     return res.json(response);
//   } catch (err) {
//     return res.status(500).send('Something blew up. We\'re looking into it.');
//   }
// });

router.post('/slack/command/ETO',(req, res) =>{
    res.status(200).end() // best practice to respond with empty 200 status code
    var reqBody = req.body
    var username=reqBody.user_name;
    // console.log(reqBody);
    var responseURL = reqBody.response_url
    if(reqBody.text == ""){
        const welcome = {
            "response_type": "in_channel",
            "text":"/eto",
            "blocks": [
              {
                  "type": "section",
                  "text": {
                      "type": "mrkdwn",
                      "text": "Hi "+username+"!" 
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
                  "image_url": "https://gsimageakshina.s3.amazonaws.com/GS_YahooFinanceChart.png",
                  "alt_text": "GS Stock Price"
                }
          ]
        };
    
        sendMessageToSlackResponseURL(responseURL, welcome);
    }
    else if(reqBody.text=="directory"){
        const message = {
            "response_type": "in_channel",
            "text": "Welcome to SlackHero's team directory!",
            "attachments": [
                {
                    "text": "Which team are you from?",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "button_tutorial",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "APPHERO",
                            "text": "APPHERO",
                            "type": "button",
                            "value": "ap"
                        },
                        {
                            "name": "KEYSTONE",
                            "text": "KEYSTONE",
                            "type": "button",
                            "value": "ke"
                        },
                        {
                            "name": "ML & ANALYTICS",
                            "text": "ML & ANALYTICS",
                            "type": "button",
                            "value": "ml",
                        }
                    ]
                }
            ]
        };
        sendMessageToSlackResponseURL(responseURL, message);
    }

        else if(reqBody.text=="create dashboard"){
            const message = {
                "response_type": "in_channel",
             "text": "Do you want to create a new AppHero dashboard?",
            "attachments": [
                {
                    // "text": "Which team are you from?",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "button_tutorial",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "CREATE",
                            "text": "CREATE",
                            "type": "button",
                            "value": "create"
                        },
                        {
                            "name": "EXIT",
                            "text": "EXIT",
                            "type": "button",
                            "value": "exit"
                        },
                    ]
                }
            ]
            };
            sendMessageToSlackResponseURL(responseURL, message);
        }
        
    


  

    });

    router.post('/slack/command/stock',urlencodedParser,(req, res) =>{
        res.status(200).end() // best practice to respond with empty 200 status code
        var reqBody = req.body
        console.log(reqBody);
        var responseURL = reqBody.response_url
        let message;
        if(reqBody.text == "current"){
            message = {
                // "channel": "C1H9RESGL",
                "response_type": "in_channel",
                "blocks": [
                  {
                    "type": "section",
                    "text": {
                      "type": "mrkdwn",
                      "text": "Goldman Sachs Group Inc"
                    }
                  },
                  {
                    "type": "section",
                    "block_id": "section567",
                    "text": {
                      "type": "mrkdwn",
                      "text": "<https://www.marketwatch.com/investing/stock/gs| Click Here!> \n Daily Stock price for our firm."
                    },
                    "accessory": {
                        "type": "image",
                        "image_url": "https://gsimageakshina.s3.amazonaws.com/GS_YahooFinanceChart.png",
                    }
                  },
                  {
                    "type": "context",
                    "elements": [
                        {
                            "type": "plain_text",
                            "text": "Do wish to compare with other firms?",
                            "emoji": true
                        }
                    ]
                  },
                  {

                    "type": "actions",
                   
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "YES",
                                "emoji": true
                            },
                            "value": "yes_stock"
                        },
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "NO",
                                "emoji": true
                            },
                            "value": "no_stock"
                        },
                       

                    ]
                }
               
            ]
        };
        }else if(req.body.text == "history"){
            message = {
            "response_type": "in_channel",
            "channel": "C1H9RESGL",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "Goldman Sachs Group Inc"
                }
              },
              {
                "type": "section",
                "block_id": "section567",
                "text": {
                  "type": "mrkdwn",
                  "text": "<https://www.marketwatch.com/investing/stock/gs| Click Here!> \n Daily Stock price for our firm."
                },
                "accessory": {
                    "type": "image",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Goldman_Sachs.svg/1200px-Goldman_Sachs.svg.png",
                    "alt_text": "GS"
                }
              },
              {
                "type": "context",
                "elements": [
                    {
                        "type": "plain_text",
                        "text": "Do wish to compare with other firms?",
                        "emoji": true
                    }
                ]
              },
              {

                "type": "actions",
               
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "YES",
                            "emoji": true
                        },
                        "value": "yes_stock"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "NO",
                            "emoji": true
                        },
                        "value": "no_stock"
                    },
                   

                ]
            }
           
        ]
        };
         
    }
    else{

      message= {
        "response_type": "in_channel",
            "text":"/stock",
        blocks: [
          {
              "type": "section",
              "text": {
                  "type": "mrkdwn",
                  "text": "Hi "+reqBody.user_name+"!" 
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
              "image_url": "https://gsimageakshina.s3.amazonaws.com/GS_YahooFinanceChart.png",
              "alt_text": "GS Stock Price"
            }
      ]
      }
    }
    sendMessageToSlackResponseURL(responseURL, message);
});


function sendMessageToSlackResponseURL(responseURL, JSONmessage){
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: JSONmessage
    }
    request(postOptions, (error, response, body) => {
        if (error){
            // handle errors as you see fit
        }
    })
}

router.post('/slack/actions', urlencodedParser, (req, res) =>{
    res.status(200).end() // best practice to respond with 200 status
    const actionJSONPayload = JSON.parse(req.body.payload) // parse URL-encoded payload JSON string
    let value = actionJSONPayload.actions[0].value;
    console.log(value);
    var message;
    try{
        if( value== "ap") {
            message = {
                "response_type": "in_channel",
            "text": "App Hero Team!",
            "attachments": [
                {
                    "text": "Which Sub-team are you in?",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "button_tutorial",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "Alert Management",
                            "text": "ALM",
                            "type": "button",
                            "value": "ALM"
                        },
                        {
                            "name": "Plant Health Management and Star",
                            "text": "PHM + * ",
                            "type": "button",
                            "value": "PHM"
                        },
                        {
                            "name": "Core",
                            "text": "Core",
                            "type": "button",
                            "value": "Core",
                        }
                    ]
                }
            ]
            };
            sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
        }
        else if(value=="ml"){
            message = {
                "response_type": "in_channel",
                "text": "Machine Learning and Analytics Team!",
                "attachments": [
                    {
                        "text": "Which Sub-team are you in?",
                        "fallback": "Shame... buttons aren't supported in this land",
                        "callback_id": "button_tutorial",
                        "color": "#3AA3E3",
                        "attachment_type": "default",
                        "actions": [
                            {
                                "name": "Alert Management",
                                "text": "ALM",
                                "type": "button",
                                "value": "ALM"
                            },
                            {
                                "name": "Plant Health Management and Star",
                                "text": "PHM + * ",
                                "type": "button",
                                "value": "PHM"
                            },
                            {
                                "name": "Core",
                                "text": "Core",
                                "type": "button",
                                "value": "Core",
                            }
                        ]
                    }
                ]
                };
                sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
        }
        else if(value=="ke"){
            message = {
                "response_type": "in_channel",
                // "text": "Select one of the firm!",
                "attachments": [
                    {
                        "text": "Select one firm",
                        "fallback": "Shame... buttons aren't supported in this land",
                        "callback_id": "button_tutorial",
                        "color": "#3AA3E3",
                        "attachment_type": "default",
                        "actions": [
                            {
                                "name": "JP Morgan Chase",
                                "text": "JPMC",
                                "type": "button",
                                "value": "JPM"
                            },
                            {
                                "name": "Bank of America",
                                "text": "BOA ",
                                "type": "button",
                                "value": "BOA"
                            },
                            {
                                "name": "Walmart",
                                "text": "Walmart",
                                "type": "button",
                                "value": "Walmart",
                            }
                        ]
                    }
                ]
                };
                sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
        }
        else if(value=="yes_stock"){
            // console.log("here!");
            message = {
                "response_type": "in_channel",
                "text": "Stock prices!",
                "attachments": [
                    {
                        "text": "Select a firm?",
                        "fallback": "Shame... buttons aren't supported in this land",
                        "callback_id": "button_tutorial",
                        "color": "#3AA3E3",
                        "attachment_type": "default",
                        "actions": [
                            {
                                "name": "JP Morgan Chase",
                                "text": "JPMC",
                                "type": "button",
                                "value": "JPM"
                            },
                            {
                                "name": "Bank of America",
                                "text": "BOA",
                                "type": "button",
                                "value": "BOA"
                            },
                            {
                                "name": "Walmart",
                                "text": "Walmart",
                                "type": "button",
                                "value": "Walmart",
                            }
                        ]
                    }
                ]
                };
                sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
        }
        else if(value=="no_stock" || value=="exit"){
            message= {
                "response_type": "in_channel",
                "text": " Alright! Thank you for using Slack Hero!",
            };
            sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
        // console.log("done!");
        }
        else if(value=='Walmart'){
          console.log("walmart!");
          message = {
            // "channel": "C1H9RESGL",
            "response_type": "in_channel",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "Walmart Labs"
                }
              },
              // {
              //   "type": "section",
              //   "block_id": "section2ss7",
              //   "text": {
              //     "type": "plain_text",
              //     "text": "Thanks for visitng Walmart labs, India!"
              //   },
              //   "accessory": {
              //       "type": "image",
              //       "image_url": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fmiro.medium.com%2Fmax%2F3360%2F1*y7tufhvds8S-_Ghb9lMf-Q.jpeg&imgrefurl=https%3A%2F%2Fmedium.com%2F%40anirudhkanabar%2Fa-summer-at-walmart-labs-week-1-a862edd06837&tbnid=XUwJ8e7s0fJqoM&vet=12ahUKEwi9u_b3k4bqAhVt0HMBHUjqA_IQMygFegUIARDCAQ..i&docid=_R1zgfP7FDZoUM&w=1680&h=1050&q=Walmart%20labs&client=safari&ved=2ahUKEwi9u_b3k4bqAhVt0HMBHUjqA_IQMygFegUIARDCAQ",
              //       "alt_text": "GS"
              //   }
              // }, 
            ]
              
         };
         sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
        }
        else if(value=='create'){
           const view = {
            "type": "modal",
            "title": {
              "type": "plain_text",
              "text": "Create a new Dashboard"
            },
            "blocks": [
              {
                "type": "input",
                "label": {
                  "type": "plain_text",
                  "text": "Name"
                },
                "element": {
                  "type": "plain_text_input",
                  "action_id": "input1",
                  "placeholder": {
                    "type": "plain_text",
                    "text": "Enter dashboard name"
                  },
                  "multiline": false
                },
                "optional": false
              },
              {
                "type": "input",
                "label": {
                  "type": "plain_text",
                  "text": "Owner"
                },
                "element": {
                  "type": "plain_text_input",
                  "action_id": "input2",
                  "placeholder": {
                    "type": "plain_text",
                    "text": "Kerberos"
                  },
                  "multiline": false
                },
                "optional": false
              },
           
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "Editor"
                },
              },
              {
                "type": "section",
                "block_id": "section1",
                "text": {
                  "type": "mrkdwn",
                  "text": "Provide PERMIT Domain"
                },
                "accessory": {
                  "action_id": "action_1",
                  "type": "static_select",
                  "placeholder": {
                    "type": "plain_text",
                    "text": "Select a domain"
                  },
                  "options": [
                    {
                      "text": {
                        "type": "plain_text",
                        "text": "com.gs"
                      },
                      "value": "cgs"
                    },
                    {
                      "text": {
                        "type": "plain_text",
                        "text": "com.gs.demo"
                      },
                      "value": "cgsd"
                    },
                    {
                      "text": {
                        "type": "plain_text",
                        "text": "com.gs.fw"
                      },
                      "value": "cgsf"
                    }
                  ]
                }
              },
              {
                "type": "section",
                "block_id": "section2",
                "text": {
                  "type": "mrkdwn",
                  "text": "Provide a Role"
                },
                "accessory": {
                  "action_id": "action_1",
                  "type": "static_select",
                  "placeholder": {
                    "type": "plain_text",
                    "text": "Select a role"
                  },
                  "options": [
                    {
                      "text": {
                        "type": "plain_text",
                        "text": "com.gs"
                      },
                      "value": "cgs"
                    },
                    {
                      "text": {
                        "type": "plain_text",
                        "text": "com.gs.demo"
                      },
                      "value": "cgsd"
                    },
                    {
                      "text": {
                        "type": "plain_text",
                        "text": "com.gs.fw"
                      },
                      "value": "cgsf"
                    }
                  ]
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "plain_text",
                  "text": "Roles"
                },
              },
              {
                "type": "section",
                "block_id": "section3",
                "text": {
                  "type": "mrkdwn",
                  "text": "Proive a PERMIT Domain"
                },
                "accessory": {
                  "action_id": "action_1",
                  "type": "static_select",
                  "placeholder": {
                    "type": "plain_text",
                    "text": "Select a domain"
                  },
                  "options": [
                    {
                      "text": {
                        "type": "plain_text",
                        "text": "com.gs"
                      },
                      "value": "cgs"
                    },
                    {
                      "text": {
                        "type": "plain_text",
                        "text": "com.gs.demo"
                      },
                      "value": "cgsd"
                    },
                    {
                      "text": {
                        "type": "plain_text",
                        "text": "com.gs.fw"
                      },
                      "value": "cgsf"
                    }
                  ]
                }
              },
              {
                "type": "section",
                "block_id": "section4",
                "text": {
                  "type": "mrkdwn",
                  "text": "Provide a role"
                },
                "accessory": {
                  "action_id": "action_1",
                  "type": "static_select",
                  "placeholder": {
                    "type": "plain_text",
                    "text": "Select a role"
                  },
                  "options": [
                    {
                      "text": {
                        "type": "plain_text",
                        "text": "com.gs"
                      },
                      "value": "cgs"
                    },
                    {
                      "text": {
                        "type": "plain_text",
                        "text": "com.gs.demo"
                      },
                      "value": "cgsd"
                    },
                    {
                      "text": {
                        "type": "plain_text",
                        "text": "com.gs.fw"
                      },
                      "value": "cgsf"
                    }
                  ]
                }
              }
            ],
            "close": {
              "type": "plain_text",
              "text": "Cancel"
            },
            "submit": {
              "type": "plain_text",
              "text": "Save"
            },
            "private_metadata": "Shhhhhhhh",
            "callback_id": "view_identifier_12"
          };
       
                req.sapp.client.views.open({token:bottoken, trigger_id:actionJSONPayload.trigger_id, view: view});
            //      sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
        }
        else if(value=='JPMC'){
          message = {
            // "channel": "C1H9RESGL",
            "response_type": "in_channel",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "JP Morgan and Chase!"
                }
              },
              // {
              //   "type": "section",
              //   "block_id": "section2ss7",
              //   "text": {
              //     "type": "plain_text",
              //     "text": "Thanks for visitng Walmart labs, India!"
              //   },
              //   "accessory": {
              //       "type": "image",
              //       "image_url": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fmiro.medium.com%2Fmax%2F3360%2F1*y7tufhvds8S-_Ghb9lMf-Q.jpeg&imgrefurl=https%3A%2F%2Fmedium.com%2F%40anirudhkanabar%2Fa-summer-at-walmart-labs-week-1-a862edd06837&tbnid=XUwJ8e7s0fJqoM&vet=12ahUKEwi9u_b3k4bqAhVt0HMBHUjqA_IQMygFegUIARDCAQ..i&docid=_R1zgfP7FDZoUM&w=1680&h=1050&q=Walmart%20labs&client=safari&ved=2ahUKEwi9u_b3k4bqAhVt0HMBHUjqA_IQMygFegUIARDCAQ",
              //       "alt_text": "GS"
              //   }
              // }, 
            ]
              
         };
         sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
        }
        else if(value=='ALM'){
            // console.log('indide ALM');
            message= {
                "response_type": "in_channel",
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Akshina: RM 123"
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Suhavi: RM 123"
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Thanks, for visiting ALM directory!"
                        }
                    },
                ]
            };
            sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
        }
        else if(value=='PHM'){
          message= {
            "response_type": "in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Akshina: RM 123"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Suhavi: RM 123"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Thanks, for visiting PHM + Star directory!"
                    }
                },
            ]
        };
        sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
        }
        else if(value=='CORE'){
          message= {
            "response_type": "in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Kartik: RM 123"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Amit: RM 123"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Thanks, for visiting Core directory!"
                    }
                },
            ]
        };
        sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
        }
        if(value=="BOA"){
          message = {
            // "channel": "C1H9RESGL",
            "response_type": "in_channel",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "Bank of America!"
                }
              },
              // {
              //   "type": "section",
              //   "block_id": "section2ss7",
              //   "text": {
              //     "type": "plain_text",
              //     "text": "Thanks for visitng Walmart labs, India!"
              //   },
              //   "accessory": {
              //       "type": "image",
              //       "image_url": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fmiro.medium.com%2Fmax%2F3360%2F1*y7tufhvds8S-_Ghb9lMf-Q.jpeg&imgrefurl=https%3A%2F%2Fmedium.com%2F%40anirudhkanabar%2Fa-summer-at-walmart-labs-week-1-a862edd06837&tbnid=XUwJ8e7s0fJqoM&vet=12ahUKEwi9u_b3k4bqAhVt0HMBHUjqA_IQMygFegUIARDCAQ..i&docid=_R1zgfP7FDZoUM&w=1680&h=1050&q=Walmart%20labs&client=safari&ved=2ahUKEwi9u_b3k4bqAhVt0HMBHUjqA_IQMygFegUIARDCAQ",
              //       "alt_text": "GS"
              //   }
              // }, 
            ]
              
         };
         sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
        }
    }
    catch(err){
        console.log(err);
    }
    

    
    
});

module.exports = router;