// This is a one time worked to update gleams table
// 1. Get all items from the gleams table
// 2. Get all items from result_subscriptions table
// 3. count how many times each gleam is subscribed to. Match tables by url field
// 4. Update the gleam table with the new count

const AWS = require('aws-sdk');
AWS.config.update({
    region: "us-east-2"
});

const dynamodb = new AWS.DynamoDB();


exports.handler = async function (event, context, callback) {
    try {
        let params = {
            TableName: "gleams",
        };

        let params2 = {
            TableName: "result_subscriptions",
        };

        let res1 = await dynamodb.scan(params).promise();
        let res2 = await dynamodb.scan(params2).promise();

        let gleams = res1.Items;
        let subscriptions = res2.Items;

        let gleams_to_update = [];
        //for each gleam, count how many times it is subscribed to. Update the count
        for (let i = 0; i < gleams.length; i++) {
            let gleam = gleams[i];
            let gleam_subscriptions = 0;
            for (let j = 0; j < subscriptions.length; j++) {
                let subscription = subscriptions[j];
                if (subscription.gleam_url.S == gleam.url.S) {
                    gleam_subscriptions++;
                }
            }
            if (gleam_subscriptions > 0) {
                //prepare params for update
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
                    UpdateExpression: "set subscribers = :subscribers",
                    ExpressionAttributeValues: {
                        ":subscribers": {
                            N: gleam_subscriptions.toString()
                        }
                    },
                    ReturnValues: "UPDATED_NEW"
                };
                gleams_to_update.push(params3);
                console.log(gleam_subscriptions);
            }
        }

        //update the tables
        for (let i = 0; i < gleams_to_update.length; i++) {
            // console.log("Updating gleam:", gleams_to_update[i]);
            await dynamodb.updateItem(gleams_to_update[i]).promise();
        }

    } catch (err) {
        console.log(err);
    } finally {
        callback(null, "Done");
    }


};