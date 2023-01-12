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
        var params = {
            TableName: "gleams",
        };
        dynamodb.scan(params, onScan);
       

    } catch (err) {
        console.log(err);
    } finally {
        callback(null, "Done");
    }

    

    async function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // print all the movies
            console.log("Scan succeeded. Got " + data.Items.length + " gleams.");
            let gleams_to_update = data.Items.filter(gleam => gleam.title.S.toLowerCase().includes("whitelist") || gleam.title.S.toLowerCase().includes("airdrop"));
            console.log("Found gleams to update:", gleams_to_update.length);
            // //update the tables
            for (let i = 0; i < gleams_to_update.length; i++) {
                let gleam = gleams_to_update[i];
                // console.log("Updating gleam:", gleam.url.S);
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
                    UpdateExpression: "set tags = :tags",
                    ExpressionAttributeValues: {
                        ":tags": {
                            S: "whitelist",
                        },
                    },
                };
                dynamodb.updateItem(params3).promise();
            }

            // continue scanning if we have more entries
            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                dynamodb.scan(params, onScan);
            }
        }
    }

};