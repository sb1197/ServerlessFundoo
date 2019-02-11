var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB({ region: "us-west-2", apiVersion: "2012-08-10" });

/**
 * @description: This is the simple hello lambda function that is called from api to print message on the browser
 */
module.exports.hello = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};

/**
 * @description: This is the lambda function for registering user and storing user_details in the database 
 */
module.exports.register = (event, context, callback) => {
  var table = "userData";
  var email = "yamaha@gmail.com";
  var password = "123456789";
  var params = {
    TableName: table,
    Item: {
      "userEmail": {
        S: email.toString(),
      },
      "userPassword": {
        S: password.toString(),
      }
    }
  };
  console.log("Adding a new item...");
  dynamodb.putItem(params, function (err, data) {
    if (err) {
      callback(err);
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    }
    else {
      callback(null, data);
      console.log("Added item:", JSON.stringify(data, null, 2));
    }
  });
};

/**
 * @description: This is the login lambda function to fetch user_credentials for login from database
 */

module.exports.login = async (event) => {
  var response = {
    statusCode: 200,
    body: JSON.stringify({'msg':'success'}),
  };
  
  var result =  await getUser();
  console.log("Result 2:"+JSON.stringify(result));
  response.body = JSON.stringify(result);
  console.log("Response:"+JSON.stringify(response));
  return response;
};
/*
module.exports.login = (event, context, callback) => {
  var table = "register";
  var params = {
    TableName: table,
    Key: {
      "email": {
        S: "shweta@gmail.com"
      }
    }
  };
  console.log("Getting user_details...");
  dynamodb.getItem(params, function (err, data) {
    if (err) {
      callback(err);
      console.error("Unable to get item. Error JSON:", JSON.stringify(err, null, 2));
    }
    else {
      const response = {
         statusCode: 200,
         body: JSON.stringify('User Successfully Logged in!'),
       };
      callback(null, response);
      console.log("Logged in user:", JSON.stringify(data, null, 2));
      // return response;

    }
  });
};
*/

function getUser() {
  return new Promise(function(resolve, reject) {
    var table = "userData";
    var params = {
      TableName: table,
      Key: {
        "userEmail": {
          S: "yamaha@gmail.com"
        },
        "userPassword": {
          S: "123456789"
        }
      }
    };
    console.log("Getting user_details...");
  
    dynamodb.getItem(params, function(err, data){
      if (err) {
        console.log("Error:"+err);
        reject(err);
      } else {
        console.log("Result:"+JSON.stringify(data));
        resolve(data);
      } 
    });
  }); 
  
} 
