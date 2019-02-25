var model = require('./model');
var utility = require('./utility/utility');

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
  const url = `https://4pnr7j9868.execute-api.us-west-2.amazonaws.com/serverless/users/verifyEmail?id=${userToken.token}`;
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

/**
 * @description: This is the verifyEmail lambda function to verify 
 *                Registration data is requested by valid user or not.
 */
module.exports.verifyEmail = async (event) => {
  console.log('Event params===', event.queryStringParameters);
  console.log('Event params id ===', event.queryStringParameters.id);

  var verifyUserResult = await model.verifyUserToken(event.queryStringParameters.id);
  console.log("Logged In User:" + JSON.stringify(verifyUserResult));
  var response = {
    statusCode: 200,
    body: JSON.stringify({ 'msg': 'User verified successfully' }),
  };
  return response;
};

/**
* @description: This is the lambda function for forget pssword it take user email 
*/
module.exports.forgetPassword = async (event) => {
  console.log("event in forget password : ", event);
  // to convert text into a JavaScript object
  var parseParam = JSON.parse(event.body);
  console.log("event email is: ", parseParam.userEmail);
  var response = {
    statusCode: 200,
    body: JSON.stringify({ 'msg': 'success' }),
  };
  const payload = parseParam.userEmail;
  console.log('Payload is at forget pass====', payload);
  const jwtToken = utility.GenerateToken(payload);
  console.log("125---handler----", jwtToken.token);
  const url = `https://4pnr7j9868.execute-api.us-west-2.amazonaws.com/serverless/users/resetPassword?id=${jwtToken.token}`;
  console.log("url is: ", url);
  //converts a JavaScript object or value to a JSON string
  response.body = JSON.stringify(url);
  return response;
}

/**
* @description: This is the lambda function for reset password 
*/
module.exports.resetPassword = async (event) => {
  console.log("event is reset password :", event);
  console.log("token in query : ", event.queryStringParameters.id);
  var result = await model.verifyUserToken(event.queryStringParameters.id);
  console.log("logged in user for reset password: ", JSON.stringify(result));
  var parseParam = JSON.parse(event.body);
  userPassword = parseParam.userPassword;
  var req = {
    "userPassword": userPassword,
    "result": result
  }
  var resultNewPassword = await model.updatePassword(req);
  console.log("new password in result body : ", resultNewPassword);
  var response = {
    statusCode: 200,
    body: JSON.stringify({ 'msg': 'successfully reset password' }),
  };
  return response;
}

module.exports.getUsers = async (event) => {
  console.log("event is :", event);
  var resultOfUser = await model.getUsers();
  console.log("150---handler---Result :" + JSON.stringify(resultOfUser));
  var response = {
    statusCode: 200,
    body: JSON.stringify({ 'msg': 'success' }),
  };
  response.body = JSON.stringify(resultOfUser);
  return response;
}

module.exports.authFunction = function (event, context, callback) {
  console.log("216---handler---req : ", event.authorizationToken);
  
  
  var result = model.verifyUserToken(event.authorizationToken);
  console.log('decoded token in result',result);
  
  switch (event.authorizationToken) 
  {
    case 'allow':
      callback(null, generatePolicy('user', 'Allow', event.methodArn));
      break;
    case 'deny':
      callback(null, generatePolicy('user', 'Deny', event.methodArn));
      break;
    case 'unauthorized':
      callback("Unauthorized"); // Return a 401 Unauthorized response
      break;
    default:
      callback("Error: Invalid token");
  }
};

// Help function to generate an IAM policy
var generatePolicy = function (principalId, effect, resource) {
  var authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    var statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  
  return authResponse;
};

