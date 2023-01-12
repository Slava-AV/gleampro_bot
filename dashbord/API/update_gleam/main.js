//this serverless function does the following:
//1. update gleam in DB
//parameters to update: referral_url, tags, results_url


let AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-2"
});
const dynamo = new AWS.DynamoDB();

exports.handler = (event, context, callback) => {
    let body = JSON.parse(event.body);
    let params = {
        TableName: "gleams",
        Key: {
            "url": {
                S: body.url
            },
            "time_added": {
                S: body.time_added.toString()
            }
        },
        UpdateExpression: "set referral_url = :referral_url, tags = :tags, results_url = :results_url, sent = :sent, good = :good",
        ExpressionAttributeValues: {
            ":referral_url": {
                S: body.referral_url?body.referral_url:""
            },
            ":tags": {
                S: body.tags
            },
            ":sent": {
                S: body.sent?body.sent:"false"
            },
            ":results_url": {
                S: body.results_url?body.results_url:""
            },
            ":good": {
                S: body.good?body.good.toString():"-"
            }
        },
        ReturnValues: "UPDATED_NEW"
    };
    dynamo.updateItem(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(null, {
                statusCode: 500,
                body: JSON.stringify(err),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            })
        } else {
            callback(null, {
                statusCode: 200,
                body: "success",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            })
        }
    });


    


}