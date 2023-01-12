//this serverless function does the following:
//1. get all subscriptions from result_subscriptions table
//2. check if the subscription's time_end is more than 24 hours back
//3. if yes then send the result to the user and mark the subscription as sent

let AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-2"
});
const dynamo = new AWS.DynamoDB();
const TelegramBot = require('node-telegram-bot-api');
const bot1 = new TelegramBot(TOKEN1);
const bot2 = new TelegramBot(TOKEN2);
const moment = require('moment');
const Sentry = require("@sentry/serverless");


const msg_localisations = {
    "ru": {
        "results_ready": "конкурс, в котором вы участвовали завершен - проверьте результаты. Желаем удачи! \n",
        "results_bot": "\n\n(Cообщения о результатах можно получать через отдельного бота @GleamProResultsBot, чтобы они не затерялись)\n "

    },
    "en": {
        "results_ready": "the competition you participated in is over - check the results. Good luck! \n",
        "results_bot": "\n\n(You can get result notifications by a separate bot @GleamProResultsBot, to avoid them being lost)\n"
    }
}

exports.handler = Sentry.AWSLambda.wrapHandler(async (event, context) => {
    //query table to get all subscriptions with send = false
    let params = {
        TableName: "result_subscriptions",
        IndexName: 'sent-index',
        KeyConditionExpression: "sent = :sent",
        ExpressionAttributeValues: {
            ":sent": {
                S: "false"
            }
        }
    };

    let data = await dynamo.query(params).promise();
    //console.log(data);
    var subscriptions = data.Items;
    console.log("Got " + subscriptions.length + " subscriptions");
    //for each subscription

    for (let i = 0; i < subscriptions.length; i++) {
        let subscription = subscriptions[i];

        var chat_id = subscription.chat_id ?.S.toString();
        var time_end = subscription.time_end ?.S;
        var gleam_url = subscription.gleam_url ?.S;
        var lang = subscription.lang ?.S;
        var time_end_moment = moment(time_end, "YYYY-MM-DD HH:mm:ss");
        var now_moment = moment();
        var diff_hours = time_end_moment.diff(now_moment, 'hours');
        if (chat_id && subscription.sent ?.S === "false" && diff_hours < -24) {
            //get user from db
            var params2 = {
                TableName: "users",
                Key: {
                    "chat_id": {
                        S: chat_id
                    }
                }
            };
            var user = {};
            let data2 = await dynamo.getItem(params2).promise();
            //if error
            if (!data2?.Item) {
                bot2.sendMessage(logGroupId, "Couldn't find user " + chat_id, err);
                return
            } else {
                user = data2.Item;
                console.log("Event finishes in " + diff_hours + " hours", gleam_url);
            };
            
            //get gleam details
            let data3 = await dynamo.query({
                TableName: "gleams",

                KeyConditionExpression: "#url = :gleam_url",
                ExpressionAttributeNames: {
                    "#url": "url"
                },  
                ExpressionAttributeValues: {
                    ":gleam_url": {
                        S: gleam_url
                    }
                }
            }).promise();
            let gleam;
            if (data3?.Items?.length > 0)
            gleam = data3.Items[0];
            
            //send message to user
            const bot_sender = user.subscribed_to_results ?.S !== "true" ? bot1 : bot2;
            var msg = "💰💰💰🤞🤞🤞\n" + user.first_name ?.S + ", " + msg_localisations[lang != "ru" ? "ru" : "ru"].results_ready + gleam_url;
            
            
            // console.log(gleam);
            if (gleam?.metadata) {
            let metadata = JSON.parse(gleam.metadata.S);
            if (metadata.twitter_handle) {
                msg += "\n\nTwitter: https://twitter.com/" + metadata.twitter_handle;
            }
        }
            if (user.subscribed_to_results ?.S !== "true") {
                msg += msg_localisations[lang != "ru" ? "ru" : "ru"].results_bot;
            };

               

            if (user.subscribed_to_results ?.S === "true" || user.subscribed_to_mainbot ?.S === "true") {
                bot_sender.sendMessage(chat_id, msg, {})
                    .then(_ => console.log("Message sent: " + chat_id + " " + gleam_url + " " + diff_hours))
                    .catch(err => {
                        console.log("Could not send message to user", chat_id);
                        console.log(err);
                        //inform admin
                        bot2.sendMessage(logGroupId, "Could not send message to user " + chat_id, err);
                    });
            } else {
                console.log("User " + chat_id + " is unsubscribed");
            }

            //update subscription's sent
            var params3 = {
                TableName: "result_subscriptions",
                Key: {
                    "gleam_url": {
                        S: subscription.gleam_url.S
                    },
                    "chat_id": {
                        S: chat_id
                    }
                },
                ExpressionAttributeValues: {
                    ":sent": {
                        S: "true",
                    },
                },
                UpdateExpression: "set sent = :sent",
                ReturnValues: "UPDATED_NEW"
            };
            await dynamo.updateItem(params3).promise();
            console.log("Subscription updated", gleam_url, chat_id);


        } else {
            // console.log("Condition not met, skipping", gleam_url, chat_id);
        }
    }
    return "Done";
});