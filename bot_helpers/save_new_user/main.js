const TelegramBot = require('node-telegram-bot-api');
const AWS = require('aws-sdk');
AWS.config.update({
    region: "us-east-2"
});
const Sentry = require("@sentry/serverless");

const dynamodb = new AWS.DynamoDB();
const moment = require('moment');
const bot = new TelegramBot(TOKEN);
let res = {
    statusCode: 200,
    body: "",
    "headers": {
        "Access-Control-Allow-Origin": "*"
    }
};
const tags_keyboard = {
    "reply_markup": {
        "resize_keyboard": true,
        "one_time_keyboard": true,
        "keyboard": [
            [{
                    "text": "#Airdrop",
                },
                {
                    "text": "#Whitelist",
                },
                {
                    "text": "#NFT",
                },
                {
                    "text": "#ALL",
                },

            ]
        ]
    }
}

const msg_localisations = {
    "ru": {
        "onboarting1": "Добро пожаловать. В этом боте есть все, что нужно для простой и удобной работы с конкурсами Gleam.",
        "onboarting2": "Выбери ключевые слова для фильтрации событий. Используй кнопки внизу или вводи свои слова по одному, начиная с решетки (например #Giveaway)",
        "onboarting3": "Добавляйся в группу https://t.me/gleampro, там все новости, советы и техподдержка.",
        "subscription_added": "🔔 Уведомление включено.",
        "use_results_bot": "Чтобы не пропустить результаты, подпишись на отдельного бота @GleamProResultsBot.",
        "read_the_message": "Прочтите сообщение 👇",
        "subcribe_to_results_bot": "Для отслеживания результатов подпишитесь на бота @GleamProResultsBot",
        "your_subscriptions": "Ваши подписки: ",
        "follow_results": "🔔 Следить за результатами",
        "following": "✅ Следим",
        "tell_me_about_gleam": "Расскажите мне о конкурсах Gleam",
        "what_this_bot_can_do": "Что может делать этот бот?",
        "lets_begin": "Начнем уже. Присылайте первый конкурс.",
        "tell_me_about_gleam_reply": "Gleam - это платформа, на которой различные проекты (в основном крипто) устраивают розыгрыши призов, чтобы получить охват в соцсетях и раскрутиться. \n\nДля участия в розыгрышах нужно выполнить ряд простых действий – подписаться на соцсети проекта, сделать репост, посетить страницу и т.д. \n\nСреди участников разыгрываются призы - например NFT, айрдропы и вайтлисты (право на приоритетную покупку токенов проекта). Эти выигрыши можно продать за 100-500$ в зависимости от перспективности проекта. Мы будем рады выкупить или помочь вам продать ваш выигрыш. Обращайтесь к админам группы.\n\nУзнать обо всем подробнее и задать все интересующие вас вопросы вы можете в нашей группе поддержки: t.me/gleampro",
        "what_this_bot_can_do_reply": `Бот находит и регулярно присылает новые конкурсы Gleam. Участвуя в них каждый день, вы легко можете выигрывать несколько раз в месяц. \n
Под каждым конкурсом есть важная кнопка "Следить за результатами 🔔". Нажимайте эту кнопку, чтобы получать уведомления о результатах от бота, так как большинство конкурсов не имеют уведомений.`,
        "fist_event_guide": `Информация, которая может пригодится для участия в первом конкурсе:
- [Видео](https://t.me/gleampro/184): проходим аналогичный конкурс за 2 минуты
- Где взять [электронный кошелек](https://t.me/gleampro/56)
- Как использовать [Twitter](https://t.me/gleampro/83), если он заблокирован
- [Discord](https://t.me/gleampro/84): как создать аккаунт и добавляться в группы
- Общие [рекомендации](https://t.me/gleampro/88)
`,
        "give_me_more": "Хочу еще конкурсов"
    },
    "en": {
        "onboarting1": "Добро пожаловать. В этом боте есть все, что нужно для простой и удобной работы с конкурсами Gleam.",
        "onboarting2": "Выбери ключевые слова для фильтрации событий. Используй кнопки внизу или вводи свои слова по одному, начиная с решетки (например #Giveaway)",
        "onboarting3": "Добавляйся в группу https://t.me/gleampro, там все новости, советы и техподдержка.",
        "subscription_added": "🔔 Уведомление включено.",
        "use_results_bot": "Чтобы не пропустить результаты, подпишись на отдельного бота @GleamProResultsBot.",
        "read_the_message": "Прочтите сообщение 👇",
        "subcribe_to_results_bot": "Для отслеживания результатов подпишитесь на бота @GleamProResultsBot",
        "your_subscriptions": "Ваши подписки: ",
        "follow_results": "🔔 Следить за результатами",
        "following": "✅ Следим",
        "tell_me_about_gleam": "Расскажите мне о конкурсах Gleam",
        "what_this_bot_can_do": "Что может делать этот бот?",
        "lets_begin": "Начнем уже. Присылайте первый конкурс.",
        "tell_me_about_gleam_reply": "Gleam - это платформа, на которой различные проекты (в основном крипто) устраивают розыгрыши призов, чтобы получить охват в соцсетях и раскрутиться. \n\nДля участия в розыгрышах нужно выполнить ряд простых действий – подписаться на соцсети проекта, сделать репост, посетить страницу и т.д. \n\nСреди участников разыгрываются призы - например NFT, айрдропы и вайтлисты (право на приоритетную покупку токенов проекта). Эти выигрыши можно продать за 100-500$ в зависимости от перспективности проекта. Мы будем рады выкупить или помочь вам продать ваш выигрыш. Обращайтесь к админам группы.\n\nУзнать обо всем подробнее и задать все интересующие вас вопросы вы можете в нашей группе поддержки: t.me/gleampro",
        "what_this_bot_can_do_reply": `1️⃣ Бот находит и регулярно присылает все новые конкурсы Gleam. \n
2️⃣ С помощью команды /filter вы можете выбрать темы конкурсов. По умолчанию выбраны Airdrop и Whitelist. При выборе "ALL" бот будет присылать все конкурсы и их может приходить больше 100 в день. Обсудить наиболее интересные и перспективные можно в нашей группе - t.me/gleampro. \n
3️⃣Под каждым конкурсом есть кнопка "🔔 Следить за результатами". Так как нет единого способа узнавать о результатах, нажимайте эту кнопку чтобы не пропустить свои выигрыши.`,
        "fist_event_guide": `Информация, которая может пригодится для участия в первом конкурсе:
- [Видео](https://t.me/gleampro/184): проходим аналогичный конкурс за 2 минуты
- Где взять [электронный кошелек](https://t.me/gleampro/56)
- Как использовать [Twitter](https://t.me/gleampro/83), если он заблокирован
- [Discord](https://t.me/gleampro/84): как создать аккаунт и добавляться в группы
- Общие [рекомендации](https://t.me/gleampro/88)
`,
        "give_me_more": "Хочу еще конкурсов"
    },
}


exports.handler = Sentry.AWSLambda.wrapHandler(async (event, context) => {
    var body = JSON.parse(event.body);
    console.log(`Body - ${JSON.stringify(body)}`)

    if ("callback_query" in body) {
        console.log("Callback query");
        const chat_id = body.callback_query.from.id;
        const messageId = body.callback_query.message.message_id;
        const lang = body.callback_query.from.language_code
        const command_data = body.callback_query.data
        const message_text = body.callback_query.message.text;
        if (command_data.startsWith("follow")) {
            try {
                // user wants to follow a gleam event
                // get user from db
                const params = {
                    TableName: "users",
                    Key: {
                        "chat_id": {
                            S: chat_id.toString()
                        }
                    }
                };
                let data = await dynamodb.getItem(params).promise()
                const user = data.Item;
                const gleamUrl = command_data.split(" ")[1];

                //find gleam by url in the db
                var params1 = {
                    TableName: "gleams",
                    KeyConditionExpression: "#url = :url",
                    ExpressionAttributeNames: {
                        '#url': 'url'
                    },
                    ExpressionAttributeValues: {
                        ':url': {
                            S: gleamUrl
                        }
                    }
                };

                let data1 = await dynamodb.query(params1).promise();

                //gleam found
                const gleam = data1.Items[0];
                //create new entry in result_subscriptions table
                const params2 = {
                    TableName: "result_subscriptions",
                    Item: {
                        "gleam_url": {
                            S: gleamUrl
                        },
                        "chat_id": {
                            S: chat_id.toString()
                        },
                        "timestamp": {
                            S: new Date().toISOString()
                        },
                        "lang": {
                            S: lang
                        },
                        "time_end": {
                            S: moment.unix(gleam.time_end.S).format("YYYY-MM-DD HH:mm:ss")
                        },
                        "sent": {
                            S: "false"
                        }
                    }
                };
                await dynamodb.putItem(params2).promise();
                //update gleam: increment subscribers count
                const params3 = {
                    TableName: "gleams",
                    Key: {
                        "url": {
                            S: gleamUrl
                        },
                        "time_added": {
                            S: gleam.time_added.S
                        }
                    },
                    UpdateExpression: "set subscribers = if_not_exists(subscribers, :zero) + :one",
                    ExpressionAttributeValues: {
                        ":zero": {
                            N: "0"  
                        },
                        ":one": {
                            N: "1"
                        }
                    },
                    ReturnValues: "UPDATED_NEW"
                };
                await dynamodb.updateItem(params3).promise();

                console.log("Success saving following");

                let text = msg_localisations[lang != "ru" ? "ru" : "ru"].subscription_added;
                let options = {
                    "text": text,
                    "show_alert": true,
                    "cache_time": 15,
                };
                if (user.subscribed_to_results.S != "true") {
                    options.text += '\n\n'+ msg_localisations[lang != "ru" ? "ru" : "ru"].use_results_bot;
                    // options.url = "t.me/gleamproresultsbot?start=from_follow";
                }

                await bot.answerCallbackQuery(body.callback_query.id, options);

                // send back the same message but change the button text
                let updated_keyboard = {
                    "inline_keyboard": [
                        [{
                            "text": msg_localisations[lang != "ru" ? "en" : "ru"].following,
                            "callback_data": `unfollow ${gleamUrl}`
                        }]
                    ]
                }
                if (body.callback_query.message.text)
                    await bot.editMessageText(message_text, {
                        chat_id: chat_id,
                        message_id: messageId,
                        "reply_markup": updated_keyboard
                    });
                else if (body.callback_query.message.caption) {
                    console.log(body.callback_query.message.caption_entities);
                    await bot.editMessageCaption(body.callback_query.message.caption, {
                        chat_id: chat_id,
                        message_id: messageId,
                        "reply_markup": updated_keyboard,
                        "caption_entities": JSON.stringify(body.callback_query.message.caption_entities),
                    });
                }
                //Log
                bot.sendMessage(logGroupId, body.callback_query.from.first_name + " following: " + gleamUrl)
            } catch (e) {
                console.log(e);
                bot.sendMessage(logGroupId, "@astafieff ⚠⚠⚠ Error saving following: " + body.callback_query.from.first_name +" "+ chat_id + "  " + e);
            } finally {
                return res;
            }
        } else if (command_data.startsWith("buttonclick")) {
            try {
                let command = command_data.split(" ")[1];
                console.log("buttonclick", command);

                //User pressed button that should reply back with some text message
                if (msg_localisations['ru'][command + "_reply"]) {
                    //send back a reply
                    bot.sendMessage(chat_id, msg_localisations[lang != "ru" ? "en" : "ru"][command + "_reply"], {
                        "disable_web_page_preview": true
                    })
                }
                if (command == "lets_begin") {
                    let params2 = {
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
                    };

                    let data = await dynamodb.query(params2).promise()

                    console.log("Scan gleams:", data.Items.length);
                    //filter only with good == true
                    let gleams = data.Items.filter(gleam => {
                        return gleam.good?.S == "true"
                    });
                    //filter only with date_end > now + 1 day
                    gleams = gleams.filter(gleam => {
                        return moment.unix(gleam.time_end.S).isAfter(moment().add(1, 'hour'))
                    });
                    console.log("Filtered gleams:", gleams.length);
                    //sort by date_end
                    gleams.sort((a, b) => {
                        return moment.unix(a.time_end.S).isAfter(moment.unix(b.time_end.S)) ? 1 : -1
                    });
                    let gleam = gleams[0];
                    console.log(gleam?.title);

                    //send recent gleams to users
                        let msg;
                        let inline_keyboard = [
                            [{
                                text: msg_localisations[lang != "ru" ? "en" : "ru"].follow_results,
                                callback_data: "follow " + gleam.url.S
                            }]
                        ];
                        let options = {
                            reply_markup: JSON.stringify({
                                inline_keyboard: inline_keyboard
                            }),
                            disable_web_page_preview: true,
                            parse_mode: "Markdown",
                            caption: createMessage(gleam),
                        };
                        // let url_tosend = gleam.referral_url && gleam.referral_url.S.length > 3 ? gleam.referral_url.S : gleam.url.S;
                        let metadata = JSON.parse(gleam.metadata.S);
                        await bot.sendPhoto(chat_id, metadata.image, options);

                    // create keyboard with one button to ask for more
                    let inline_keyboard1 = [
                        [{
                            text: msg_localisations[lang != "ru" ? "en" : "ru"].give_me_more,
                            callback_data: "buttonclick give_me_more"
                        }]
                    ];
                    //delay for 1 sec
                    await sleep(1000);
                    await bot.sendMessage(chat_id, msg_localisations[lang != "ru" ? "ru" : "ru"].fist_event_guide, {
                        "disable_web_page_preview": true,
                        "parse_mode": "Markdown",
                        "reply_markup": JSON.stringify({
                            inline_keyboard: inline_keyboard1
                        })
                    })
                }
                // new user asks for more gleams
                else if (command == "give_me_more") {

                    let params = {
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
                    let data = await dynamodb.query(params).promise()

                    console.log("Got gleams:", data.Items.length);
                    const recent_gleams = [];

                    //filter only with good == true
                    let gleams = data.Items.filter(gleam => {
                        return gleam.good?.S == "true"
                    });
                    //filter only with date_end > now + 1 day
                    gleams = gleams.filter(gleam => {
                        return moment.unix(gleam.time_end.S).isAfter(moment().add(1, 'hour'))
                    });
                    console.log("Filtered gleams:", gleams.length);
                    //sort by date_end
                    gleams.sort((a, b) => {
                        return moment.unix(a.time_end.S).isAfter(moment.unix(b.time_end.S)) ? 1 : -1
                    });
                    gleams.shift();
                    if (gleams.length > 5)
                        gleams.splice(5);
                    console.log("Got recent good gleams:", gleams.length);

                    //send recent gleams to users
                   for (let i = 0; i < gleams.length; i++) {
                        let gleam = gleams[i];
                        let msg = createMessage(gleam);
                        let inline_keyboard = [
                            [{
                                text: msg_localisations[lang != "ru" ? "en" : "ru"].follow_results,
                                callback_data: "follow " + gleam.url.S
                            }]
                        ];
                        let options = {
                            reply_markup: JSON.stringify({
                                inline_keyboard: inline_keyboard
                            }),
                            "disable_web_page_preview": true,
                            "parse_mode": "Markdown",
                            "caption": msg,
                        };
                        let metadata = JSON.parse(gleam.metadata.S);
                        await bot.sendPhoto(chat_id, metadata.image, options);
                    }
                }
                bot.sendMessage(logGroupId, body.callback_query.from.first_name + " " + chat_id + ": " + command)

                //inform admin
            } catch (e) {
                console.log(e);
                bot.sendMessage(logGroupId, body.callback_query?.from?.first_name + " " + chat_id + ": @astafieff ⚠⚠⚠ Error buttonclick" + e);
            } finally {
                return res;
            }

        } else {
            console.log("Unrecognized callback request");
            bot.sendMessage(logGroupId, body.callback_query ?.from ?.first_name + " " + chat_id + " Unrecognized callback query: " + command_data);
            return res;
        }

    } else if (body.my_chat_member) {
        //user unsubscribed 
        try {
            if (body.my_chat_member.new_chat_member ?.status == "kicked") {
                console.log("User unsubscribed");
                //mark user unsubscribed in db
                const params = {
                    TableName: "users",
                    Key: {
                        "chat_id": {
                            S: body.my_chat_member.chat.id.toString()
                        }
                    },
                    UpdateExpression: "set subscribed_to_mainbot = :val",
                    ExpressionAttributeValues: {
                        ":val": {
                            S: "unsubscribed"
                        }
                    }
                };
                await dynamodb.updateItem(params).promise();
                console.log("User record updated");
                bot.sendMessage(logGroupId, "User unsubscribed: " + body.my_chat_member.chat.first_name + " " + body.my_chat_member.chat.username + " " + body.my_chat_member.chat.id);

            } else if (body.my_chat_member.new_chat_member ?.status == "member") {
                console.log("User re-subscribed");
                //mark user re-subscribed in db
                const params = {
                    TableName: "users",
                    Key: {
                        "chat_id": {
                            S: body.my_chat_member.chat.id.toString()
                        }
                    },
                    UpdateExpression: "set subscribed_to_mainbot = :val",
                    ExpressionAttributeValues: {
                        ":val": {
                            S: "true"
                        }
                    }
                };
                await dynamodb.updateItem(params).promise();
                bot.sendMessage(logGroupId, "User re-subscribed: " + body.my_chat_member.chat.first_name + " " + body.my_chat_member.chat.username + " " + body.my_chat_member.chat.id);
            } else {
                console.log("unrecognized new member request")
                bot.sendMessage(logGroupId, "Unrecognized new member request \n" + JSON.stringify(body.my_chat_member));
            }
        } catch (e) {
            console.log(e);
            bot.sendMessage(logGroupId, chat_id + ": Error unsubscribing \n" + e);
        } finally {
            return res;
        }
    }

    // Message with no command
    else if (!body.message) {
        console.log("Message with no command")
        console.log(body.message)
        //Log
        bot.sendMessage(logGroupId, "Message with no command: " + JSON.stringify(body))
        return res;
    } else if (body.message ?.text ?.toLowerCase() == "/help") {
        console.log("Help request")
        let keyboard1 = {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: msg_localisations[body.message.from.language_code != "ru" ? "en" : "ru"].what_this_bot_can_do,
                        callback_data: "buttonclick what_this_bot_can_do"
                    }, ],
                    [{
                        text: msg_localisations[body.message.from.language_code != "ru" ? "en" : "ru"].tell_me_about_gleam,
                        callback_data: "buttonclick tell_me_about_gleam"
                    }, ],
                    [{
                        text: msg_localisations[body.message.from.language_code != "ru" ? "en" : "ru"].lets_begin,
                        callback_data: "buttonclick lets_begin"
                    }]
                ]
            }
        }
        let chat_id = body.message.chat.id;
        try {
            await bot.sendMessage(chat_id, msg_localisations[body.message.from.language_code != "ru" ? "en" : "ru"].onboarting1, keyboard1);
            //Log
            bot.sendMessage(logGroupId, body.message.from.first_name + " " + body.message.from.username + " " + chat_id + ": " + body.message.text);
        } catch (e) {
            console.log("Error sending message", e);
            bot.sendMessage(logGroupId, "@astafieff ⚠⚠⚠ Error on Help request \n" + e);
        } finally {
            return res;
        }

    } else if (body.message && body.message.text && body.message.text.toLowerCase() == "/start") {
        //user wants to subscribe to bot
        try {
            console.log("/start request")
            const chat_id = body.message.chat.id;
            const lang = body.message.from.language_code;
            console.log(`Telegram ID - ${chat_id}`);

            const params = {
                TableName: 'users',
                Item: {
                    "chat_id": {
                        "S": chat_id.toString()
                    },
                    "first_name": {
                        "S": body.message.from.first_name
                    },
                    "username": {
                        "S": body.message.from.username ? body.message.from.username : ""
                    },
                    "language_code": {
                        "S": body.message.from.language_code
                    },
                    "subscribed_to_results": {
                        "S": "false"
                    },
                    "subscribed_to_mainbot": {
                        "S": "true"
                    },
                    "created_at": {
                        "S": new Date().toISOString()
                    },
                    "tags": {
                        "S": "airdrop,whitelist"
                    },
                    "referral_code": {
                        "S": makeReferralCode()
                    },
                    "referral_count": {
                        "N": "0"
                    }
                },
                ConditionExpression: "attribute_not_exists(chat_id)"
            };

            // Save user to DB
            await dynamodb.putItem(params).promise();
            console.log("Saved user succesfully");
            let keyboard1 = {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: msg_localisations[body.message.from.language_code != "ru" ? "en" : "ru"].what_this_bot_can_do,
                            callback_data: "buttonclick what_this_bot_can_do"
                        }, ],
                        [{
                            text: msg_localisations[body.message.from.language_code != "ru" ? "en" : "ru"].tell_me_about_gleam,
                            callback_data: "buttonclick tell_me_about_gleam"
                        }, ],
                        [{
                            text: msg_localisations[body.message.from.language_code != "ru" ? "en" : "ru"].lets_begin,
                            callback_data: "buttonclick lets_begin"
                        }]
                    ]
                }
            }
            await bot.sendMessage(chat_id, msg_localisations[body.message.from.language_code != "ru" ? "en" : "ru"].onboarting1, keyboard1);

            bot.sendMessage(logGroupId, `New user: ${body.message.from.first_name} ${body.message.from.username}`);

        } catch (e) {
            console.log(e);
            bot.sendMessage(logGroupId, `Error saving new user: ${e}`);
        } finally {
            return res;
        }


    } else if (body.message ?.text ?.toLowerCase() == "/filter") {
        try {
            console.log("/filter request")
            const chat_id = body.message.chat.id;
            const params = {
                TableName: 'users',
                Key: {
                    "chat_id": {
                        "S": chat_id.toString()
                    }
                }
            };

            let data = await dynamodb.getItem(params).promise();
            console.log("DB read succesfull");
            let user_tags = data.Item.tags ? data.Item.tags.S : "";
            user_tags = user_tags.replace(/,/g, " | ");
            let msg = msg_localisations[body.message.from.language_code != "ru" ? "en" : "ru"].your_subscriptions;

            if (user_tags.length > 0)
                msg += user_tags
            else
                msg += "All"

            //send message with inline keyboard
            await bot.sendMessage(chat_id, msg, tags_keyboard);
            bot.sendMessage(logGroupId, `User ${body.message.from.first_name} ${chat_id}: /filter`);
        } catch (e) {
            console.log(e);
            bot.sendMessage(logGroupId, `Error processing /filter: ${e}`);
        } finally {
            console.log("/filter request finished")
            return res;
        }
    }
    //if text stars with # - update user tag preferenes. If tag already present - remove it.
    else if (body.message && body.message.text && body.message.text.toLowerCase().startsWith("#")) {
        try {
            console.log("tags update request")
            //get user preferences from DB
            const chat_id = body.message.chat.id;
            const tag = body.message.text.toLowerCase().substring(1);

            const params = {
                TableName: 'users',
                Key: {
                    "chat_id": {
                        "S": chat_id.toString()
                    }
                }
            };

            let data = await dynamodb.getItem(params).promise();

            let user_tags = data.Item.tags.S
            console.log("DB read succesfull");
            //if tag is present - remove it
            if (user_tags.includes(tag)) {
                user_tags = user_tags.replace(tag, "")
            }
            //if tag is not present - add it
            else {
                user_tags = user_tags + "," + tag
            }
            //remove double commas
            user_tags = user_tags.replace(",,", ",");
            //remove trailing commas
            if (user_tags.startsWith(","))
                user_tags = user_tags.substring(1);

            if (tag == "all") {
                user_tags = ""
            }
            //update DB
            const params1 = {
                TableName: 'users',
                Key: {
                    "chat_id": {
                        "S": chat_id.toString()
                    }
                },
                UpdateExpression: "set tags = :tags",
                ExpressionAttributeValues: {
                    ":tags": {
                        "S": user_tags
                    }
                },
                ReturnValues: "UPDATED_NEW"
            };

            await dynamodb.updateItem(params1).promise();

            console.log("DB update succesfull");
            //replace commas with pipe
            user_tags = user_tags.replace(/,/g, " | ");
            let msg = msg_localisations[body.message.from.language_code != "ru" ? "en" : "ru"].your_subscriptions

            if (user_tags.length > 0)
                msg += user_tags
            else
                msg += "All"
            bot.sendMessage(chat_id, msg);
        } catch (e) {
            console.log(e);
            bot.sendMessage(logGroupId, `Error processing tags update: ${e}`);
        } finally {
            return res;
        }

    } else {
        console.log("Unrecognized request");
        console.log(body.message ?.text);
        try {
            await bot.sendMessage(logGroupId, `${body.message?.chat?.id} : unrecognized request ${body.message?.text}`);
        } catch (e) {
            console.log(e);
            bot.sendMessage(logGroupId, `Error sending message to log group: ${e}`);
        } finally {
            return res;
        }
    }
});

function makeReferralCode() {
    //function to generate referral code with 4 symbols: numbers and small letters
    const length = 5;
    let code = "";
    for (let i = 0; i < length; i++) {
        let symbol = Math.floor(Math.random() * (122 - 97 + 1)) + 97;
        code += String.fromCharCode(symbol);
    }
    return code;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createMessage(gleam) {
    let url_tosend = gleam.referral_url && gleam.referral_url.S.length > 3 ? gleam.referral_url.S : gleam.url.S;

    if (gleam.metadata) {
    let metadata = JSON.parse(gleam.metadata.S);
    let msg = "*" + toTitleCase(metadata.campaign_name) + "* \n";

    if (metadata.rewards_count)
        msg += "\nПризы: " + metadata.rewards_count + " шт.";
    if (metadata.participants_count)
        msg += "\nУчаствуют: " + roundInt(metadata.participants_count) + " чел. ";
    if (metadata.twitter_followers)
        msg += "\Twitter: " + roundInt(metadata.twitter_followers);
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
    return msg;
}
else {
    return '\n' + gleam.title.S + "\n" + url_tosend;
}
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
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
    console.log("rounding", value);
    if (value < 1000) {
        return Math.round(+value / 100) * 100;
    } else {
        let rounded = Math.round(+value / 1000) * 1000;
        //replace 000 with K
        return rounded//.toString().replace("000", "K");
    }
}
   