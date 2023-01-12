//this serverless function does the following:
//1. get all users from the users table
//2. get all gleams with sent not equal to true
//3. for each user, send a telegram message to the user with the gleam

let AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-2"
    // region: "ap-south-1"
});
const Sentry = require("@sentry/serverless");

const dynamo = new AWS.DynamoDB();
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(TOKEN);

const moment = require('moment');

exports.handler = Sentry.AWSLambda.wrapHandler(async (event, context) => {
    //get all users from dynamo with subscribed_to_mainbot == "true"

    let params0 = {
        TableName: "settings",
        Key: {
            "app": {
                S: "main"
            }
        }
    };

    let data0 = await dynamo.getItem(params0).promise();

    let settings = data0.Item;
    console.log(settings);

    let send_filter = settings.send_filter.S;


    let params1 = {
        TableName: "users",
        FilterExpression: "#subscribed_to_mainbot = :subscribed_to_mainbot",
        ExpressionAttributeNames: {
            '#subscribed_to_mainbot': 'subscribed_to_mainbot'
        },
        ExpressionAttributeValues: {
            ':subscribed_to_mainbot': {
                S: "true"
            }
        }
    };
    let paramsQuery = {
        TableName: "gleams",
        IndexName: "good-sent-index",
        ExpressionAttributeValues: {
            ':good': {
                S: "true"
            },
            ':sent': {
                S: "false"
            }
        },
        KeyConditionExpression: "good = :good and sent = :sent",
        // FilterExpression: "sent = :sent",
    };
    let params2 = {
        TableName: "gleams",
        IndexName: "time_end-index",
        FilterExpression: "sent <> :sent",
        ExpressionAttributeValues: {
            ":sent": {
                S: "false"
            }
        },
    };

    let users = await dynamo.scan(params1).promise();
    console.log("Got users:", users.Items.length);
    // let gleams = await dynamo.scan(params2).promise();
    let gleams = await dynamo.query(paramsQuery).promise();
    console.log("Got gleams:", gleams.Items.length);
    let gleams_array = [];
    for (let i = 0; i < gleams.Items.length; i++) {
        // console.log("Difference hours:", moment().diff(moment.unix(gleams.Items[i].time_added.S), 'hours'));
        // if (moment().diff(moment.unix(gleams.Items[i].time_added.S), 'hours') > 6) {
        //if data_filter = only_good, check if gleam's good == true
        if ((send_filter == "only_good" && gleams.Items[i].good ?.S == "true") || send_filter == "all")
            if (moment().diff(moment.unix(gleams.Items[i].time_end.S), 'hours') > -parseInt(settings.send_before.S) && moment().diff(moment.unix(gleams.Items[i].time_end.S), 'hours') < 0) {
                gleams_array.push(gleams.Items[i]);
                console.log(gleams.Items[i].title.S, "is ready for sending", moment().diff(moment.unix(gleams.Items[i].time_end.S), 'hours'), "hours");
            }
            else
                console.log(gleams.Items[i].title.S, gleams.Items[i].url.S, "will be sent in", moment().diff(moment.unix(gleams.Items[i].time_end.S), 'hours'), "hours");
    }
    console.log("Got gleams to send:", gleams_array.length);
    if (gleams_array.length == 0) return

    let gleam = gleams_array[0];

    // update sent to true for the gleam
    let params3 = {
        TableName: "gleams",
        Key: {
            "url": {
                S: gleam.url.S
            },
            "time_added": {
                S: gleam.time_added.S
            }
        },
        ExpressionAttributeValues: {
            ":sent": {
                S: "true"
            }
        },
        UpdateExpression: "SET sent = :sent",
        ReturnValues: "UPDATED_NEW"
    };
    console.log("Updating sent to true for gleam " + gleam.url.S);
    let updateResponse = await dynamo.updateItem(params3).promise();
    console.log("Update response:", updateResponse);

    let sent_count = 0;

    for (let i = 0; i < users.Items.length; i++) {
        let user = users.Items[i];
        let chat_id = user.chat_id?.S;
        if (chat_id) {
            let msg = ""
            //if we have a referral link - use it
            let url_tosend = gleam.referral_url && gleam.referral_url.S.length > 3 ? gleam.referral_url.S : gleam.url.S;

            //add inline keyboard with follow button
            let inline_keyboard = [
                [{
                    text: msg_localisations["ru"].follow_results,
                    callback_data: "follow " + gleam.url?.S
                }]
            ];
            let options = {
                reply_markup: JSON.stringify({
                    inline_keyboard: inline_keyboard
                })
            };
            //send message with inline keyboard.
            let send_response;
            if (gleam.metadata ?.S) {
                let metadata = JSON.parse(gleam.metadata.S);
                let msg = "*" + toTitleCase(metadata.campaign_name) + "* \n";

                if (metadata.rewards_count)
                    msg += "\nПризы: " + metadata.rewards_count + " шт.";
                if (metadata.participants_count)
                    msg += "\nУчаствуют: " + roundInt(metadata.participants_count) + " чел. ";
                if (metadata.twitter_followers)
                    msg += "\nTwitter: " + roundInt(metadata.twitter_followers);
                msg += "\nЗаканчивается: _" + moment.unix(gleam.time_end.S).format('DD.MM.YYYY') + "_";

                msg += "\n\n" + metadata.entry_methods.length + " заданий: ";
                msg += "```\n";

                metadata.entry_methods.forEach(function (entry_method) {
                    if (entry_method.entry_type !== "custom_action" && tasks[entry_method.entry_type])
                        if (msg.indexOf(tasks[entry_method.entry_type]) == -1)
                            msg += tasks[entry_method.entry_type] + ", ";
                });
                // if last symbol is comma remove it
                if (msg.slice(-2) == ", ") msg = msg.slice(0, -2);
                msg += "```";
                msg += "\n\n" + "👉 " + "[Участвовать в конкурсе](" + url_tosend + ")";
                send_response = bot.sendPhoto(chat_id, metadata.image, {
                    caption: msg,
                    parse_mode: 'Markdown',
                    reply_markup: JSON.stringify({
                        inline_keyboard: inline_keyboard
                    })
                })
                send_response.then(function (response) {
                    sent_count++;
                }
                ).catch(function (err) {
                    console.log(err);
                    console.log("Error sending message to user", err?.response ?.body ?.error_code, err.response ?.body ?.description);
                    bot.sendMessage(logGroupId, "Ошибка отправки сообщения пользователю " + user.chat_id.S + ": " + err);
                    // if  403 Forbidden: user is deactivated - delete the user from the database
                    if (err?.response?.body?.error_code == 403 && err?.response?.body?.description == 'Forbidden: user is deactivated') {
                        console.log("User is deactivated. Deleting user from database");
                        let params = {
                            TableName: "users",
                            Key: {
                                "chat_id": {
                                    S: user.chat_id.S
                                }
                            }
                        };
                        dynamo.deleteItem(params).promise();
                    }
                })

            } else {
                msg = gleam.title.S + "\n" + url_tosend;
                send_response = bot.sendMessage(chat_id, msg, options)
                send_response.then(function (response) {
                    sent_count++;
                }
                ).catch(function (e) {
                    console.log(e);
                })
            }
            await timer(50);
        }
    }

    console.log("Sent " + sent_count + " mesesages to " + users.Items.length + " users");
    bot.sendMessage(logGroupId, "Sent " + sent_count + " mesesages to " + users.Items.length + " users");
    return true;


})


const timer = ms => new Promise(res => setTimeout(res, ms))

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

const msg_localisations = {
    "ru": {
        "follow_results": "Следить за результатами 🔔",
        "subscribed": "✅ Следим",
    },
    "en": {
        "follow_results": "Follow results 🔔",
        "subscribed": "✅ Following",
    }
}

const tasks = {
    "twitter_follow": "Подписаться на Твиттер",
    "twitter_retweet": "Ретвитнуть",
    "telegram_join": "Подписаться на Телеграм",
    "discord_join_server": "Подписаться на Дискорд",
    "instagram_visit_profile": "Посетить Инстаграм ⏩",
    "youtube_visit_channel": "Посетить YouTube ⏩",
}

function roundInt(value) {
    // console.log("rounding", value);
    if (value < 1000) {
        return Math.round(+value / 100) * 100;
    } else {
        let rounded = Math.round(+value / 1000) * 1000;
        //replace 000 with K
        return rounded//.toString().replace("000", "K");
    }
}
   