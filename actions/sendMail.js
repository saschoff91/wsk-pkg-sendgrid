/*
 * Copyright 2015-2016 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var request = require('request');

/**
 * An action to create new device Type in Watson IoT platform.
 * @param      {string}  apiKey                     (required)  Sendgrid account api key
 * @param      {string}  to                  		(required)  Mail adress of receiver, like test@ibm.com
 * @param      {string}  from                       (required)  Mail adress of sender
 * @param      {string}  message                    (required)  Mail content
 * @param      {string}  subject                    (optional)  Mail subject
 * @param      {string}  contentType                (optional)  Mail content type, e.g. text/plain
 * @param      {string}  cc 		                (optional)  Multiply mail receiver, seperated with a comma
 * @return     {Object}                                         Done with the result of invocation
 **/


function main(params) {
	console.log(params);

	var requiredParams = ["apikey", "to", 'from', 'message'];

	var contentType = params.contentType || "text/plain";

	checkParameters(params, requiredParams, function(missingParams) {
		if (missingParams != "") {
			console.error("Missing required parameters: " + missingParams);
			return whisk.error("Missing required parameters: " + missingParams);
		} else {
			var data;
			var uri = "api.sendgrid.com/v3/mail/send";

			if (params.cc) {

				createCCList(params.cc.split(","), function(ccRecipientList) {
					data = { personalizations: [{
						to: [{email: params.to }],
						cc: ccRecipientList
					}],
					from: {email: params.from},
					subject: params.subject,
					content: [{type: contentType, value: params.message}]
					}; 
				});


			} else {
				data = {personalizations: [{
					to: [{email: params.to }]}],
					from: {email: params.from},
					subject: params.subject,
					content: [{type: contentType, value: params.message}]
				}; 
			}

			var options = {
					uri: 'https://'+uri,

					method: 'POST',
					headers: { 	
						'Authorization' : 'Bearer '+params.apikey, 
						'Content-Type' : 'application/json'
					},
					json: data
			};

            request(options, function(err, res, body) {
                if (!err && res.statusCode == 202) {
                    //var parsedBody = JSON.parse(body);
                    whisk.done({result: "Mail send successful! "});

                } else {
                    whisk.error({
                        statusCode: (res || {}).statusCode,
                        error: err,
                        body: body
                    });
                }
            });


		}
	});

	return whisk.async();
} 

/**
 *  A function that check whether the parameters passed are required or not
 *
 * @param      {object}    params    An object contains the parameter required
 *                                   in order to check it and generate a string
 *                                   that contains a list of missing parameters
 * @param      {Function}  callback  the callback function has the generated
 *                                   array or an empty one if the params is
 *                                   empty or nothing is missing
 */
function checkParameters(params, requiredParams, callback) {
	console.log("Checking Existence of Required Parameters");
	var missingParams = [];
	for (var i = requiredParams.length - 1; i >= 0; i--) {
		console.log(requiredParams[i]);
		if (!params.hasOwnProperty(requiredParams[i])) {
			missingParams.push(requiredParams[i]);
		}
		if (i == 0)
			return callback(missingParams);
	}
}

/**
 *  A function that create a valid cc list for sendgrid restful api
 *
 * @param      {object}    ccList    An object contains a seperated list of
 									 multiply recipiens.
 * @param      {Function}  callback  the callback function has the generated
 *                                   array of receivers, 
 									 e.g. {"email":"recipient2@example.com"}...
 */
function createCCList(ccList, callback) {
	console.log("Creating cc list");
	var ccListJson = [];

	ccList.forEach(function(recipient) {
		ccListJson.push({email: recipient});
	});

	return callback(ccListJson);
}
