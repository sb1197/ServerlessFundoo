var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB({ region: "us-west-2", apiVersion: "2012-08-10" });
var model = require('./model');
/**
 * @description: This is the simple hello lambda function that is called from api to print message on the browser
 */
module.exports.hello = async (event) => {
        const response = {
          statusCode: 200,
          body: JSON.stringify('Hello from Lambda!'),
          result:result
        };
    return response;
  };

  /**
   * @description: This is the lambda function for registering user and storing user_details in the database 
   */
  module.exports.register = async (event) => {
    var email = "radha@gmail.com";
    var password = "123456789";
    var req = {
      user_email : email,
      user_pass : password
    }
    var registerResult = await model.registerUser(req);
     console.log("User Registered :" + JSON.stringify(registerResult));
    // response.body = JSON.stringify(result);
    //  console.log("Response:" + JSON.stringify(res));
    // console.log("Email : ",response.Item.userEmail);
    var response = {
      statusCode: 200,
      body: JSON.stringify({ 'msg': 'success' }),
    };
    return response;
  };

/**
 * @description: This is the login lambda function to fetch user_credentials for login from database
 */

module.exports.login = async (event) => {
  var email = "maya@gmail.com";
  var password = "123456789";
  var req = {
    user_email : email,
    user_pass : password
  }
  var LoginResult = await model.loginUser(req);
  console.log("Logged In User:" + JSON.stringify(LoginResult));
  var response = {
    statusCode: 200,
    body: JSON.stringify({ 'msg': 'success' }),
  };
 
  response.body = JSON.stringify(LoginResult);
  console.log("Response:" + JSON.stringify(response));
  // console.log("Email : ",response.Item.userEmail);
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
