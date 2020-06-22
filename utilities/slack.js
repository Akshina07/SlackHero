const { App } = require('@slack/bolt');
const slackSigningSecret = require('../config/keys').SLACK_SIGNING_SECRET;
const token = require('../config/keys').SLACK_USER_TOKEN;


const Userapp = new App({
    token: token,
    signingSecret: slackSigningSecret
  });

  module.export = Userapp;