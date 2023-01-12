const TelegramBot = require('node-telegram-bot-api');
const AWS = require('aws-sdk');
AWS.config.update({
    region: "us-east-2"
});

const Sentry = require("@sentry/serverless");

const dynamodb = new AWS.DynamoDB();
const bot = new TelegramBot(TOKEN);

const { TwitterApi } = require('twitter-api-v2');

var msg_localisations = {
    "ru": {
        "bot_frst_msg": "Теперь уведомления о результатах будут приходить сюда!"

    },
    "en": {
        "bot_frst_msg": "Now you will get notifications about results here!"
    }
}

exports.handler = Sentry.AWSLambda.wrapHandler(async (event, context) => {
    var res = {
        statusCode: 200,
        body: "",
        "headers": {
            "Access-Control-Allow-Origin": "*"
        }
    };
    try {
        console.log(`Body - ${event.body}`)
        var body = JSON.parse(event.body);
        if ("callback_query" in body) {
            if (!body.message) console.log("no body message")
            return res;
        }

        // Message with no command
        else if (!body.message) {
            console.log("Message: ", body.message)
            console.log("No /start request")

        } else if (body.message.text.toLowerCase() == "/start") {
            console.log("/start request")
            const chat_id = body.message.chat.id;
            const lang = body.message.from.language_code;
            console.log(`Telegram ID - ${chat_id}`);

            const params = {
                TableName: "users",
                Key: {
                    "chat_id": {
                        S: chat_id.toString()
                    }
                },
                UpdateExpression: "set subscribed_to_results = :val",
                ExpressionAttributeValues: {
                    ":val": {
                        S: "true"
                    }
                },
                ReturnValues: "ALL_NEW"
            };

            let response = await dynamodb.updateItem(params).promise();
            console.log(response);
            // send welcome message
            await bot.sendMessage(chat_id, msg_localisations[body.message.from.language_code != "ru" ? "ru" : "ru"].bot_frst_msg, {}).catch(err => {
                console.log(err);
            });
            bot.sendMessage(logGroupId, `${body.message.from.first_name} ${chat_id} subscribed to Results Bot`)

        } else if (body.message.text.toLowerCase() == "/connect_twitter") {
            const chat_id = body.message.chat.id;
            console.log("/connect_twitter request")
            const client = new TwitterApi({ appKey: APP_KEY, appSecret: APP_SECRET });
            try {
            const authLink = await client.generateAuthLink("oob", { linkMode: 'authorize' });
            console.log(authLink);
            let msg = "Нажмите, чтобы [авторизоваться в Twitter](" + authLink.url + ")👈" + "\n" + "После авторизации введите сюда код подтверждения:";
            await bot.sendMessage(chat_id, msg, {
                parse_mode: "Markdown"
            });
            }
            catch (err) {
                console.log(err);
                await bot.sendMessage(chat_id, "Ошибка при подключении к Twitter");
            }
        } 
        
        else {
            console.log("Unrecognized request");
            console.log(body.message.text);
        }
    } catch {
        console.log("Error")
    } finally {
        console.log("Done")
        return res;
    }
});