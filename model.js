// const bcrypt = require('bcrypt');       //Requiring Bcrypt to create hash of the user password stored in database 
// let saltRounds = 10;

var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB({ region: "us-west-2", apiVersion: "2012-08-10" });
var utility = require('./utility/utility');

function userModel() {

}

userModel.prototype.registerUser = (req) => {
  console.log('Incoming Request :--', req);
  console.log('user send email:===', req.user_email);
  console.log('user send pass===', req.user_pass);
  return new Promise(function (resolve, reject) {
    var table = "userDetail";
    var params = {
      TableName: table,
      Item: {
        "userEmail": {
          S: req.user_email,
        },
        "userPassword": {
          S: req.user_pass,
        }
      }
    };
    console.log("Adding user_details...");
    dynamodb.putItem(params, function (err, data) {
      if (err) {
        console.log("Error:" + err);
        reject(err);
      } else {
        console.log("Result:" + JSON.stringify(data));
        resolve(data);
      }
    });
  })
}

userModel.prototype.loginUser = (req) => {
  return new Promise(function (resolve, reject) {
    var table = "userDetail";
    var params = {
      TableName: table,
      Key: {
        "userEmail": {
          S: req.user_email,
        },
        // "userPassword": {
        //   S: req.user_pass,
        // }
      }
    };
    console.log("Getting user_details...");
    console.log('user email in model===', req.user_email);
    console.log('user password in model===', req.user_pass);
    dynamodb.getItem(params, function (err, data) {
      if (err) {
        console.log("Error:" + err);
        reject(err);
      } else {
        console.log("63--Result:" + JSON.stringify(data));
        resolve(data);
      }
    });
  });
}

userModel.prototype.verifyUserToken = (req) => {
  var request = {
    headers: req
  }
  console.log('Token to verify is---', request);
  return new Promise(function (resolve, reject) {
    utility.checkToken(request, (err, data) => {
      if (err) {
        console.log("Error:" + err);
        reject(err);
      }
      else {
        console.log("82--Decoded Result:" + JSON.stringify(data));
        resolve(data);
      }
    })
  })
}

userModel.prototype.updatePassword = (req) => {
  console.log("90---model----req : ", req);
  return new Promise(function (resolve, reject) {
    var table = "userDetail";
    var params = {
      TableName: table,
      Key: {
        "userEmail": {
          S: req.result.payload,
        },
      },
      ExpressionAttributeValues: {
        ":p": {
          S: req.userPassword
        }
      },
      UpdateExpression: "SET userPassword = :p",
      ReturnValues: "ALL_NEW"
    };
    console.log("131---model--update password");
    dynamodb.updateItem(params, function (err, data) {
      if (err) {
        console.log("error : ", err);
        reject(err);
      }
      else {
        console.log(JSON.stringify(data, null, 2));
        resolve(data);
      }
    });
  });
};

userModel.prototype.getUsers = () => {
  return new Promise(function (resolve, reject) {
    var table = "userDetail";
    var params = {
      TableName: table
    };
    dynamodb.scan(params, function (err, data) {
      if (err) {
        console.log("error : ", err);
        reject(err);
      }
      else {
        console.log(JSON.stringify(data));
        resolve(data);
      }
    });
  });
}


module.exports = new userModel();