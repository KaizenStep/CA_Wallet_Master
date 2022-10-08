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
  //console.log( req.body );
  console.log('edit');
  logData(req);
  res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  //console.log( req.body );
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
      console.log('API ready');
	  
        var sf_client_id = process.env.sf_client_id;
        var sf_client_secret = process.env.sf_client_secret;
        var sf_username = process.env.sf_username;
        var sf_password = process.env.sf_password;

      var Method = decodedArgs.Method;
      console.log(Method+'check | SerialNumber: ' + decodedArgs.SerialNumber[1]);

      var obj = {};
      if (Method == 'Create') {
        var FirstName = decodedArgs.FirstName[1];
        var LastName = decodedArgs.LastName[1];
        var Phone = decodedArgs.Phone[1];
        var Name = FirstName + ' ' + LastName;
        var ContactId = decodedArgs.ContactID[1];
        var WalletId = decodedArgs.WalletID;
        var Balance = decodedArgs.Balance[1];
        var Level = decodedArgs.Level[1];

        var Message = "Nuevo pass";
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
        var FirstName = decodedArgs.FirstName[1];
        var LastName = decodedArgs.LastName[1];
        var Phone = decodedArgs.Phone[1];
        var Name = FirstName + ' ' + LastName;
        var ContactId = decodedArgs.ContactID[1];
        var WalletId = decodedArgs.WalletID;
        var Balance = decodedArgs.Balance[1];
        var Level = decodedArgs.Level[1];
        
        var MetodoAPI = "PUT";
        var SerialNumber = decodedArgs.SerialNumber[1];
        var URLpasscreation = process.env.URLpasscreation + SerialNumber;

        if (WalletId === 'Undefined' || WalletId.lenght === 0){ }else{
          obj["walletId"] = WalletId;
        }
        if (Name === 'Undefined' || Name.lenght === 0 || Name === '' || Name === ' ') { }else{
          obj["name"] = Name;
        }
        if (Phone === 'Undefined' || Phone.lenght === 0 || Phone === '' || Phone === ' ') { }else{
          obj["Phone"] = Phone;
        }
        if (Balance === 'Undefined' || Balance.lenght === 0 || Balance === '' || Balance === ' ') { }else{
          obj["balance"] = Balance;
        }
        if (Level === 'Undefined' || Level.lenght === 0 || Level === '' || Level === ' ') { }else{
          obj["level"] = Level;
        }

      } else if (Method == 'Push') {
        
        var WalletId = decodedArgs.WalletID;
         
        var MetodoAPI = "PUT";
        var SerialNumber = decodedArgs.SerialNumber[1];
        var MessagePush = decodedArgs.MessagePush;
        var URLpasscreation = process.env.URLpasscreation + SerialNumber;

        if (WalletId === 'Undefined' || WalletId.lenght === 0) { }else{
          obj["walletId"] = WalletId;
        }
        if (MessagePush === 'Undefined' || MessagePush.lenght === 0) { }else{
          obj["Message"] = MessagePush;
        }

      }

      console.log(Method + '|Method: ' + Method);
      console.log(Method + '|MetodoAPI: ' + MetodoAPI);
      console.log(Method + '|URLpasscreation: ' + URLpasscreation);
      console.log(Method + '|SerialNumber: ' + SerialNumber);
      console.log(Method + '|Name: ' + Name);
      console.log(Method + '|Phone: ' + Phone);
      console.log(Method + '|ContactId: ' + ContactId);
      console.log(Method + '|WalletId: ' + WalletId);
      console.log(Method + '|Balance: ' + Balance);
      console.log(Method + '|Level: ' + Level);
      console.log(Method + '|Message: ' + Message);
      console.log(Method + '|json: ' + JSON.stringify(obj));

      var request = require('request');
      var response;
      var access_token;
      var SerialNumber;
      var PassURL;
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
        console.log(response.body);
        var response = JSON.parse(response.body);
        var access_token = response["access_token"];
        console.log('Token: ' + access_token);

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
          console.log(Method + '|response: ' + response2.body);
          var response2 = JSON.parse(response2.body);
          var SerialNumber = response2["serialNumber"];
          var PassURL = response2["url"];
          console.log(Method + '|SerialNumber: ' + SerialNumber);
          console.log(Method + '|PassURL: ' + PassURL);
        });


      });





      console.log('API END');
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
  //console.log( req.body );
  console.log('publish');
  logData(req);
  res.send(200, 'Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  //console.log( req.body );
  console.log('validate');

  logData(req);
  res.send(200, 'Validate');
};
