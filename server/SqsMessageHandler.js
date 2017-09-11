import {Meteor} from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  var AWS = require('aws-sdk');
  const Consumer = require('sqs-consumer');

  AWS.config.update({
    region: Meteor.settings.awsSDK.region,
    accessKeyId: Meteor.settings.awsSDK.accessKeyId,
    secretAccessKey:  Meteor.settings.awsSDK.secretAccessKey
  });

  var app = Consumer.create({
    queueUrl: Meteor.settings.sqs.queueUrl,
    handleMessage: function (message, done) {
      console.log("Got a message!");
      console.log(message.Body);
      done();
    },
    sqs: new AWS.SQS()
  });

  app.on('error', function (err) {
    console.log(err.message);
  });

  app.on('stopped', function () {
    console.log("Fired when the consumer finally stops its work");
  });

  app.on('empty', function () {
    console.log("Fired when the queue is empty (All messages have been consumed).");
  });

  console.log("about to listen for messages...");
  app.start();
});