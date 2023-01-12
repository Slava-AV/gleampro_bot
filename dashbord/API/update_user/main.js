//this serverless function does the following:
//1. update user in DB
//parameters to update: tags


let AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-2"
});
const dynamo = new AWS.DynamoDB();

exports.handler = (event, context, callback) => {
    let body = JSON.parse(event.body);
    let params = {
        TableName: "users",
        Key: {
            "chat_id": {
                S: body.chat_id
            }
        },
        UpdateExpression: "set tags = :tags",
        ExpressionAttributeValues: {
            ":tags": {
                S: body.tags
            },
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