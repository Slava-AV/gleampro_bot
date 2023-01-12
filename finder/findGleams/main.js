//this serverless functions does the following:
//1. uses gleamlist api to get links to gleams
//3. creates a new entry in DynamoDb for each page

let AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-2"
});
var dynamo = new AWS.DynamoDB();
var axios = require('axios');
var uuid = require('uuid');

const gleamlist_api = "xxxxxxxxxxxxxxxxxxxxxxx"

exports.handler = async (event, context, callback) => {

    let response = await axios.get(gleamlist_api);
    console.log("Got gleams: " + response.data.data.results.length);
    var gleams = [];
    response.data.data.results.forEach(gleam => {
        //extract keywords from title
        gleam.tags = extractKeywords(gleam.title);
        if (gleam.tags.length == 0) gleam.tags = ["-"];
        gleams.push(gleam);
    });

    let newItems = [];

    // console.log(gleams);

    

    //save each gleam to dynamo using promise.all and dynamo.updateItem
    //table key is url, sort key is time_added
    let promises = gleams.map(async gleam => {
        let params = {
            TableName: "gleams",
            Item: {
                "url": {
                    S: gleam.url
                },
                "time_added": {
                    S: gleam.time_added.toString()
                },
                "id": {
                    S: uuid.v4()
                },
                "title": {
                    S: gleam.title
                },
                "time_end": {
                    S: gleam.time_end.toString()
                },
                "tags": {
                    S: gleam.tags.join(",")
                },
                "sent": {
                    S: "false"
                },
                "good": {
                    S: "-",
                }
            },
            ConditionExpression: "attribute_not_exists(#url)",
                ExpressionAttributeNames: {
                "#url": "url",
            },
        };
        let res;
        try {
            res = await dynamo.putItem(params).promise();
            console.log("New Item")
            newItems.push(gleam);
        } catch (err) {
            console.log(err);
        }
        // return res;
    
        // let params = {
        //     TableName: "gleams",
        //     Key: {
        //         "url": {
        //             S: gleam.url
        //         },
        //         "time_added": {
        //             S: gleam.time_added.toString()
        //         }
        //     },
        //     ExpressionAttributeValues: {
        //         ":id": {
        //             S: uuid.v4()
        //         },
        //         ":title": {
        //             S: gleam.title
        //         },
        //         ":time_end": {
        //             S: gleam.time_end.toString()
        //         },
        //         ":tags": {
        //             S: gleam.tags.join(",")
        //         },
        //         // ":sent": {
        //         //     S: "false"
        //         // }
        //     },
        //     ConditionExpression: "attribute_not_exists(#url)",
        //     UpdateExpression: "SET id = :id, title = :title, time_end = :time_end, tags = :tags", //sent = :sent",
        //     ExpressionAttributeNames: {
        //         "#url": "url",
        //     },
        //     ReturnValues: "ALL_NEW"

        // };

        // Item: {
        //     "id": {
        //         S: uuid.v4()
        //     },
        //     "title": {
        //         S: gleam.title
        //     },
        //     "url": {
        //         S: gleam.url
        //     },
        //     "time_added": {
        //         S: gleam.time_added.toString()
        //     },
        //     "time_end": {
        //         S: gleam.time_end.toString()
        //     },
        // "sent": {
        //     S: "false"
        // }
        // }
        // };
        //call updateItem and log results
        // let resp = await dynamo.updateItem(params, function (err, data) {
        //     if (err) {
        //         // console.log("Error", err);
        //     } else {
        //         // console.log("Success", data);
        //     }
        // }).promise();
        // return resp;
    });

    await Promise.all(promises);
    console.log("Successfully added " + newItems.length + " items");

    callback(null, {
        statusCode: 200,
        body: "Successfully added " + newItems.length + " items",
        "headers": {
            "Access-Control-Allow-Origin": "*",
        }
    });

    //function to extract keywords from a string based on a preset list of keywords
    function extractKeywords(str) {
        var keywords = str.split(" ");
        //lowercase and remove extra symbols
        keywords = keywords.map(keyword => {
            return keyword.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
        });
        //remove empty strings
        keywords = keywords.filter(keyword => {
            return keyword != "";
        });
        //remove duplicates
        keywords = keywords.filter((keyword, index) => {
            return keywords.indexOf(keyword) == index;
        });

        var whitelist = ["whitelist", "airdrop"];
        var result = [];
        keywords.forEach(keyword => {
            if (whitelist.includes(keyword))
            result.push(keyword);
        });
        if (result == []) result = ["-"];
        return result;
    }

    function hasKeywords(text) {
        // const keywords = ["whitelist", "airdrop"];
        // for (let i = 0; i < keywords.length; i++) {
        //     if (text.toLowerCase().includes(keywords[i])) {
        //         return true;
        //     }
        // }
        return true
    }



}