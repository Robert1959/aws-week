var request = require('request');
var AWS = require('aws-sdk');
//var request = require("request");
//var AWS = require("aws-sdk");
//AWS.config.update({
    //region: 'us-east-1',
    //endpoint: 'http://dynamodb.us-east-1.amazonaws.com',
    //endpoint: 'http://dynamodb:us-east-2:838411717014:table/movieTable',
   // accessKeyId: "AKIAIJVDWB27GHXFVISQ",
   // secretAccessKey: "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"
  //});
exports.handler = (event, context, callback) => {
  var url = `https://www.omdbapi.com/?t=${event.queryStringParameters.title}&plot=short&apikey=${process.env.ombdapikey}`
  addToDynamoDB(event.queryStringParameters.title);
  request(url, (err,apiResponse,body)=>{
    if(err){
      throw err
    }
    //this format is EXTREMELY IMPORTANT
    const lambdaResponse = {
      statusCode: 200,
      body: body,
      headers: {
        "Access-Control-Allow-Origin":"*",
        "content-type": "application/json"
      }
    };
    callback(null,lambdaResponse)
  });
};

function addToDynamoDB(title){
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName:"movieTable",
    Item:{
       'id': String(new Date().getTime()),
       'name': 'Lambda Entry',
       'type' : 'HTTP',
       'title': title
    }
  };

  docClient.put(params, function(err, data) {
    if (err) {
      console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log("Added item:", JSON.stringify(data, null, 2));
    }
  });
}