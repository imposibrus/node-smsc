'use strict';

/**
 * Module dependencies.
 */
var https                = require('https');
var querystring         = require("querystring");

// End of dependencies.


/**
 * 
 * @param {Object} credentials 
 *                         .login
 *                         .password
 */
var Sender = module.exports = function (login, passwd) {
  this.credentials = {
    login: login,
    passwd: passwd
  };
};


Sender.prototype.sms = function(phones, message, cb) {
  var uri = [
    'https://www.smsc.ru/sys/send.php?login=', this.credentials.login,
    '&psw=', this.credentials.passwd,
    '&phones=', phones,
    '&mes=', querystring.escape(message),
    '&charset=utf-8',
    '&fmt=3'
  ].join('');
  this.request(uri, cb);
};


Sender.prototype.request = function(uri, cb) {
  https.get(uri, function(res) {
    var resData = '',
        resJSON = {};

    res.on('data', function(data) {
      resData += data;
    });
    res.on('end', function() {
      try {
        resJSON = JSON.parse(resData);
      } catch(e) {
        return cb(e);
      }

      cb(null, resJSON, res);
    });
  }).on('error', function(err) {
    cb(err);
  });
};
