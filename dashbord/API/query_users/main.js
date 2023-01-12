//this serverless function does the following:
//1. get all users
//2. return them as an array


let AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-2"
});
const dynamo = new AWS.DynamoDB();

exports.handler = (event, context, callback) => {
    let params = {
        TableName: "users",
    };
    dynamo.scan(params, function (err, users) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log("Got users:", users.Items.length);
            let users_array = [];
            for (let i = 0; i < users.Items.length; i++) {
                let returnObject = {};
                let info = users.Items[i];
                for (let key in info) {
                    if (info.hasOwnProperty(key)) {
                        returnObject[key] = info[key].S;
                    }
                }
                users_array.push(returnObject);
            }
            res = {
                "statusCode": 200,
                "body": JSON.stringify(users_array),
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                }
            };
            callback(null, res);                            
        }
    });

}