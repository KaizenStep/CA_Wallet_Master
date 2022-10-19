'use strict';
var util = require('util');
// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require('util');
var http = require('https');

exports.logExecuteData = [];

function logData(req) {
  exports.logExecuteData.push({
    body: req.body,
    headers: req.headers,
    trailers: req.trailers,
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    route: req.route,
    cookies: req.cookies,
    ip: req.ip,
    path: req.path,
    host: req.host,
    fresh: req.fresh,
    stale: req.stale,
    protocol: req.protocol,
    secure: req.secure,
    originalUrl: req.originalUrl
  });
  console.log("body: " + util.inspect(req.body));
  console.log("headers: " + req.headers);
  console.log("trailers: " + req.trailers);
  console.log("method: " + req.method);
  console.log("url: " + req.url);
  console.log("params: " + util.inspect(req.params));
  console.log("query: " + util.inspect(req.query));
  console.log("route: " + req.route);
  console.log("cookies: " + req.cookies);
  console.log("ip: " + req.ip);
  console.log("path: " + req.path);
  console.log("host: " + req.host);
  console.log("fresh: " + req.fresh);
  console.log("stale: " + req.stale);
  console.log("protocol: " + req.protocol);
  console.log("secure: " + req.secure);
  console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  console.log( 'edit: '+req.body );
  console.log('edit');
  logData(req);
  res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  console.log( 'save: '+req.body );
  console.log('save');
  logData(req);
  res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {

  // example on how to decode JWT
  JWT(req.body, process.env.jwtSecret, (err, decoded) => {

    // verification error -> unauthorized request
    if (err) {
      console.error(err);
      return res.status(401).end();
    }

    if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {

      // decoded in arguments
      var decodedArgs = decoded.inArguments[0];

      // API

      var request = require('request');
      var response;
      var access_token;
      var SerialNumber;
      var PassURL;
      var APIresponse1;
      var APIresponse2;
      var FirstName;
      var LastName;
      var Phone;
      var Name;
      var ContactId;
      var WalletId;
      var Balance;
      var Level;
      var SerialNumber;
      var MessagePush;

      var sf_client_id = process.env.sf_client_id;
      var sf_client_secret = process.env.sf_client_secret;
      var sf_username = process.env.sf_username;
      var sf_password = process.env.sf_password;
      var MCClientID = process.env.MCClientID;
      var MCClientSecret = process.env.MCClientSecret;
      var MCDomain = process.env.MCDomain;
      var DElog = process.env.DElog;
      var Method = decodedArgs.Method;


      FirstName = decodedArgs.FirstName[1];
      LastName = decodedArgs.LastName[1];
      Phone = decodedArgs.Phone[1];
      Name = FirstName + ' ' + LastName;
      ContactId = decodedArgs.ContactID[1];
      WalletId = decodedArgs.WalletID;
      Balance = decodedArgs.Balance[1];
      Level = decodedArgs.Level[1];
      SerialNumber = decodedArgs.SerialNumber[1];
      MessagePush = decodedArgs.MessagePush;

      var obj = {};
      var objlog = {};
      var keys = {};
      var values = {};

      var TimeStamp = new Date();
      TimeStamp = TimeStamp.toISOString();
      //console.log("arguments: " + JSON.stringify(decodedArgs));
      if (Method == 'Create') {

        var Message = "Miss Sushi";
        var MetodoAPI = "POST";
        var URLpasscreation = process.env.URLpasscreation;

        obj["contactId"] = ContactId;
        obj["walletId"] = WalletId;
        obj["name"] = Name;
        obj["phone"] = Phone;
        obj["balance"] = Balance;
        obj["level"] = Level;
        obj["message"] = Message;

      } else if (Method == 'Update') {

        var MetodoAPI = "PUT";
        var URLpasscreation = process.env.URLpasscreation + SerialNumber;

        obj["walletId"] = WalletId;

        if (Name === 'Undefined' || Name.lenght === 0 || Name === '' || Name === ' ') {} else {
          obj["name"] = Name;
        }
        if (Phone === 'Undefined' || Phone.lenght === 0 || Phone === '' || Phone === ' ') {} else {
          obj["Phone"] = Phone;
        }
        if (Balance === 'Undefined' || Balance.lenght === 0 || Balance === '' || Balance === ' ') {} else {
          obj["balance"] = Balance;
        }
        if (Level === 'Undefined' || Level.lenght === 0 || Level === '' || Level === ' ') {} else {
          obj["level"] = Level;
        }

      } else if (Method == 'Push') {

        var MetodoAPI = "PUT";
        var URLpasscreation = process.env.URLpasscreation + SerialNumber;

        obj["walletId"] = WalletId;

        if (MessagePush === 'Undefined' || MessagePush.lenght === 0) {} else {
          obj["Message"] = MessagePush;
        }

      }

      keys["ContactID"] = ContactId;
      keys["TimeStamp"] = TimeStamp;
      values["WalletId"] = WalletId;
      values["SerialNumber"] = SerialNumber;
      values["MessagePush"] = MessagePush;
      values["json"] = "[json: " + JSON.stringify(obj) + "]";
      values["endpoint"] = URLpasscreation;

      var options = {
        'method': 'POST',
        'url': 'https://login.salesforce.com/services/oauth2/token',
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
          'grant_type': 'password',
          'client_id': sf_client_id,
          'client_secret': sf_client_secret,
          'username': sf_username,
          'password': sf_password
        }
      };
      request(options, function (error, response) {


        if (error) throw new Error(error);
        if (error) {
          APIresponse1 = "[response: " + error + "]";
          values["APIresponse1"] = APIresponse1;

          objlog["keys"] = keys;
          objlog["values"] = values;

          apiMC(objlog);


          console.error('sf token error');
          //return res.status(400).end();
        } else {
          var response = JSON.parse(response.body);
          var access_token = response["access_token"];

          var options2 = {
            'method': MetodoAPI,
            'url': URLpasscreation,
            'headers': {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + access_token
            },
            body: JSON.stringify(obj)

          };
          request(options2, function (error2, response2) {
            if (error2) throw new Error(error2);
            if (error) {
              APIresponse2 = "[response: " + error + "]";
              console.error('API SF wallet error');
              //return res.status(400).end();
            } else {
              if (Method == 'Create') {
                var APIresponse2 = "[response: " + JSON.stringify(response2.body) + "]";
                var resoutarg = JSON.parse(response2.body);
                if (resoutarg["serialNumber"]) {
                  //res.send(200, {"outputAPI": "Pass created"});
                } else {
                  console.error('Error creacion pass');
                  //return res.status(400).end();

                }

              } else if (Method == 'Update') {
                var APIresponse2 = "[response: empty - updated]";

                //res.send(200, {"outputAPI": "Pass updated"});

              } else if (Method == 'Push') {
                var APIresponse2 = "[response: empty - Push]";

                //res.send(200, {"outputAPI": "Push sent"});
              }


            }

            if (Method == 'Create') {

              console.log(Method + '|response API Wallet: ' + response2.body);
              var response2 = JSON.parse(response2.body);

              SerialNumber = response2["serialNumber"];
              PassURL = response2["url"];

              values["SerialNumber"] = SerialNumber;
              values["PassURL"] = PassURL;
            }

            values["APIresponse2"] = APIresponse2;

            objlog["keys"] = keys;
            objlog["values"] = values;

            apiMC(objlog);

            /*
            console.log('Method: ' + Method);
            console.log('MetodoAPI: ' + MetodoAPI);
            console.log('URLpasscreation: ' + URLpasscreation);
            console.log('SerialNumber: ' + SerialNumber);
            console.log('Name: ' + Name);
            console.log('Phone: ' + Phone);
            console.log('ContactId: ' + ContactId);
            console.log('WalletId: ' + WalletId);
            console.log('Balance: ' + Balance);
            console.log('Level: ' + Level);
            console.log('Message: ' + MessagePush);
            console.log('json: ' + JSON.stringify(obj));
            console.log('json2: ' + JSON.stringify(objlog));
*/

          });
        }
      });

      function apiMC(objlog) {
        var options3 = {
          'method': 'POST',
          'url': 'https://' + MCDomain + '.auth.marketingcloudapis.com/v2/token',
          'headers': {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "grant_type": "client_credentials",
            "client_id": MCClientID,
            "client_secret": MCClientSecret
          })

        };

        request(options3, function (error3, response3) {
          if (error3) throw new Error(error3);
          if (error3) {} else {
            var response3 = JSON.parse(response3.body);
            var access_token3 = response3["access_token"];
            var options4 = {
              'method': 'POST',
              'url': 'https://' + MCDomain + '.rest.marketingcloudapis.com/hub/v1/dataevents/key:' + DElog + '/rowset',
              'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token3
              },
              body: '[' + JSON.stringify(objlog) + ']'

            };
            request(options4, function (error4, response4) {
              if (error4) throw new Error(error4);
              //console.log('response API MC: ' + response4.body);
            });

          }
        });
      }


      // END API


      res.send(200, 'Execute');
    } else {
      console.error('inArguments invalid.');
      return res.status(400).end();
    }
  });
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  console.log( 'publish: '+req.body );
  console.log('publish');
  logData(req);
  res.send(200, 'Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  console.log( 'validate: '+req.body );
  console.log('validate');

  logData(req);
  res.send(200, 'Validate');
};
