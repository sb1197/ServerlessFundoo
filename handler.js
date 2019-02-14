// var AWS = require("aws-sdk");
// var dynamodb = new AWS.DynamoDB({ region: "us-west-2", apiVersion: "2012-08-10" });
var model = require('./model');
var utility = require('./utility/utility');
var mailSent = require('./sendMail');
/**
 * @description: This is the simple hello lambda function that is called from api to print message on the browser
 */
module.exports.hello = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
    result: result
  };
  return response;
};

/**
 * @description: This is the lambda function for registering user and storing user_details in the database 
 */
module.exports.register = async (event) => {
  var parsedParams = JSON.parse(event.body);

  var email = parsedParams.userEmail;
  var password = parsedParams.userPassword;
  var req = {
    user_email: email,
    user_pass: password
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
  var payload = {
    user_name: req.user_email
  }
  console.log('40--payload', payload);
  const userToken = utility.GenerateToken(payload);
  console.log('42--Token return from utility while registration :===', userToken);
  const url = `http://localhost:3000/verifyEmail?id=${userToken.token}`;
  mailSent.sendEMailFunction(url);
  //Send email using this token generated
  response.body = JSON.stringify(url);
  return response;
};

/**
 * @description: This is the login lambda function to fetch user_credentials for login from database
 */

module.exports.login = async (event) => {
  var parsedParams = JSON.parse(event.body);
  console.log('Event body is---', event.body);
  console.log('Event userEmail---', parsedParams.userEmail);
  console.log('Event userPassword---', parsedParams.userPassword);
  var req = {
    user_email: parsedParams.userEmail,
    user_pass: parsedParams.userPassword
  }
  var LoginResult = await model.loginUser(req);
  console.log("Logged In User:" + JSON.stringify(LoginResult));
  var response = {
    statusCode: 200,
    body: JSON.stringify({ 'msg': 'success' }),
  };

  console.log("Response:" + JSON.stringify(response));
  console.log("User email who login : ", JSON.stringify(LoginResult.Item.userEmail));
  var payload = JSON.stringify(LoginResult.Item.userEmail);
  console.log('62--Payload ===', payload);
  var token = utility.GenerateToken();
  console.log('62--Generated token is ---', token);
  response.body = JSON.stringify(LoginResult);
  response.headers = {
    'x-auth-token': token.token
  }
  return response;
};


module.exports.verifyUser = async (event) => {
  var req = {
    headers: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTAwMzk3OTIsImV4cCI6MTU1MDEyNjE5Mn0.6FPAsSRqZyFasZrJFGycY2I97l4mPW2jsCaAOfUMjJs'
    },
    body: ''
  }
  var verifyUserResult = await model.verifyUserToken(req);
  console.log("Logged In User:" + JSON.stringify(verifyUserResult));
  var response = {
    statusCode: 200,
    body: JSON.stringify({ 'msg': 'User verified successfully' }),
  };
  return response;
};

