// const bcrypt = require('bcrypt');       //Requiring Bcrypt to create hash of the user password stored in database 
// let saltRounds = 10;

var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB({ region: "us-west-2", apiVersion: "2012-08-10" });


function userModel() {

}

userModel.prototype.registerUser = (req) => {
    console.log('Incoming Request :--', req);
    console.log('user send email:===', req.user_email);
    console.log('user send pass===', req.user_pass);
    return new Promise(function (resolve, reject) {
        var table = "userData";
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
        var table = "userData";
        var params = {
          TableName: table,
          Key: {
            "userEmail": {
              S: req.user_email,
            },
            "userPassword": {
              S: req.user_pass,
            }
          }
        };
        console.log("Getting user_details...");
    
        dynamodb.getItem(params, function (err, data) {
          if (err) {
            console.log("Error:" + err);
            reject(err);
          } else {
            console.log("Result:" + JSON.stringify(data));
            resolve(data);
          }
        });
      });
}

module.exports = new userModel();