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
 * A feed built on a twilio.com account, who can perform webhook requests.
 * @param      {string}  triggerName  (Provided by the system)       Trigger full name i.e. /namespace/triggerName/
 * @param      {string}  apiKey       (required)                     API Key of openwhisk
 * @param      {string}  actionType   (required)                     Event type from sendgrid mails, e.g. process, click, open
 * @return     {Object}                                              Done with the result of invocation
 **/

function main(params) {
	var serviceEndpoint = params.appURL; //'sendgridfeed.mybluemix.net';

	var triggerAction = params.triggerName.split("/");
	
	var whiskKey = whisk.getAuthKey().split(":");

	var lifecycleEvent = params.lifecycleEvent || 'CREATE';
	if (lifecycleEvent == 'CREATE') {
		console.log('CREATION ', params.triggerName);
		var body = {
			"actionType": params.actionType,
			"trigger": triggerAction[2],
			"namespace": triggerAction[1],
			"apikey": whiskKey
		};

		var options = {
			method: 'POST',
			url: 'http://'+serviceEndpoint+'/createFeed',
			json: body,
			auth: {
				user: whiskKey[0],
				pass: whiskKey[1]
			}
		};

		request(options, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				return whisk.done({"result":"done creation"});
			} else {
				console.log('http status code:', (response || {}).statusCode);
				console.log('error:', error);
				console.log('body:', body);
				whisk.error({
					error: error
				});
			}
		});
	} else if (lifecycleEvent == 'RESUME') {
		return whisk.error({
			error: "RESUME lifecycleEvent not implemented"
		});
	} else if (lifecycleEvent == 'PAUSE') {
		return whisk.error({
			error: "PAUSE lifecycleEvent not implemented"
		});
	} else {
		console.log('DELETING ', params.triggerName);

		var options = {
			method: "DELETE",
			url: 'http://' + serviceEndpoint + '/deleteFeed/' + triggerAction[2],
			auth: {
				user: whiskKey[0],
				pass: whiskKey[1]
			},
			headers: {
				'Content-Type': 'application/json'
			}
		};

		//var req = request(options, function(error, response, body) {
		request(options, function(error, response, body) {
			console.log('WAITING FOR ERG ');
			if (!error && response.statusCode == 200) {
				return whisk.done({"result":"deletion successful"});
			} else {
				console.log('http status code:', (response || {}).statusCode);
				console.log('error:', error);
				console.log('body:', body);
				return whisk.error({
					error: body
				});
			}
		});
		//req.end();
	}

	return whisk.async();
}
