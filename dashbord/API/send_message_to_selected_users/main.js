const TelegramBot = require('node-telegram-bot-api');

let AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-2"
});
const Sentry = require("@sentry/serverless");
const dynamodb = new AWS.DynamoDB();


exports.handler = Sentry.AWSLambda.wrapHandler(async (event, context) => {
    let body = JSON.parse(event.body);
    console.log(body);
    let users = body.users;
    let msg = body.msg;
    //for each user get info from db
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        let params = {
            TableName: "users",
            KeyConditionExpression: "chat_id = :chat_id",
            ExpressionAttributeValues: {
                ":chat_id": {
                    S: user.chat_id
                }
            },
        };
        let data = await dynamodb.query(params).promise();
        let user_info = data.Items[0];
        user.subscribed_to_results = user_info.subscribed_to_results?.S;
        console.log(user);
        let bot_sender = body.bot_select!=="results"|| user.subscribed_to_results !== "true" ? bot1 : bot2;
        try {
        bot_sender.sendMessage(user.chat_id, msg, {
            parse_mode: 'markdown'
        })
        } catch (e) {
            console.log(e);
            bot_sender.sendMessage(logGroupId, "Ошибка отправки сообщения пользователю " + user.chat_id + ": " + e);
        }
    }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Message sent'
            }),
            "headers": {
                "Access-Control-Allow-Origin": "*",
            }
        };
});
