//this serverless function does the following:
//1. get all gleams
//2. return them as an array


let AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-2"
});
const dynamo = new AWS.DynamoDB();

exports.handler = async (event, context, callback) => {
    let res = {
        "statusCode": 200,
        "body": "",
        "headers": {
            "Access-Control-Allow-Origin": "*",
        }
    };
    try {
    let body = JSON.parse(event.body);
    console.log(body);


    let params = {
        IndexName: "time_added-index",
        TableName: "gleams",
       
    }

    let gleams = {};

    console.log(params);
    if (body?.sort_direction == "Expiring first") {
        params = {
            TableName: "gleams",
            IndexName: "sent-time_end-index",
            KeyConditionExpression: "sent = :sent",
            ScanIndexForward: false,
            ExpressionAttributeValues: {
                ":sent": {
                    S: "false"
                }
            }
        }
        
    if (body?.filter !== "All") {
        params.ExpressionAttributeValues = {
            ":airdrop": {
                S: "airdrop"
            },
            ":whitelist": {
                S: "whitelist"
            },
            ":sent": {
                S: "false"
            }
        };
        params.FilterExpression = "contains(tags, :airdrop) or contains(tags, :whitelist)";
    }
            
        gleams = await dynamo.query(params).promise();
    }
    else
        gleams = await dynamo.scan(params).promise();
    console.log("Got gleams:", gleams.Items.length);

    let gleams_array = [];
    for (let i = 0; i < gleams.Items.length; i++) {
            //get all values from the item
            let returnObject = {};
            let info = gleams.Items[i];
            for (let key in info) {
                if (info.hasOwnProperty(key)) {
                    returnObject[key] = info[key].S? info[key].S : info[key].N;
                }
            }
            gleams_array.push(returnObject);
            }
   res.body = JSON.stringify(gleams_array);
} catch (err) {
    console.log(err);
}
finally {
    
    callback(null, res);
}


}