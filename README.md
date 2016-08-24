Openwhisk Sendgrid Package
============================
[![Build Status](https://travis-ci.org/saschoff91/wsk-pkg-sendgrid.svg?branch=master)](https://travis-ci.org/saschoff91/wsk-pkg-sendgrid)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)
```
wsk-pkg-sendgrid/
├── Getting started
│   └── Create Sendgrid Account
├── Actions
│   └── Send Email
├── Feed
│   └── Create Trigger
│       ├── Event Type
├── Deploy Locally
├── Further Work
├── Contributing
├── License 
```

This repository includes actions and feeds for [IBM Bluemix](http://www.ibm.com/cloud-computing/bluemix/) service Sendgrid. 

The whole communication is based on the [Sendgrd REST API](https://sendgrid.com/docs/API_Reference/index.html).

## Getting Started:
Before using this package, following preparations must be done:
  1. Create a [Sendgrid](sendgrid.com) account to get the apikey from [here](https://app.sendgrid.com/settings/api_keys)
  2. Create a general apikey if it's not existing and assign permissions to it.
  3. Go to Mail Settings [here](https://app.sendgrid.com/settings/mail_settings) and enable Event Notification.
  4. Fullfill all required parameters, e.g. HTTP POST URL and action types, who fires the POST request to your trigger provider
  5. Create a node application, which acts as a trigger provider.
  6. Create a cloudant instance to provide a storage for trigger.
  7. Bind the cloudant instance to node application, via application dashboard.
  8. Modify /feeds/TriggerProvider/app.js file and fill in your message hub instance name

``` javascript
var cloudant = appEnv.getServiceCreds('Cloudant-instance');
``` 
  9. Deploy the created node application with file from /feeds/TriggerProvider/ with 
``` 
/<PATH_TO_NODE_FILES>$ cf push
```
  ***Note:*** If you cloned this repository and deploy the application with /feeds/TriggerProvider/, change the application name in manifest.yml before. 

| Entity | Type | Parameters | Description |
| --- | --- | --- | --- |
| `/whisk.system/sendgrid` | package | apikey | Sendgrid Package |
| `/whisk.system/sendgrid/sendMail` | action | see action [details](https://github.com/saschoff91/wsk-pkg-sendgrid/blob/master/actions/sendMail.js) | send mail to multiply receiver |
| `/whisk.system/sendgrid/sendgridFeed` | action | see action [details](https://github.com/saschoff91/wsk-pkg-sendgrid/blob/master/feeds/sendgridFeed.js) |Trigger lifecycle feed |



## Actions:
To bind parameters to the package perform following command ( appURL without 'http://')
```bash
wsk package update sendgrid -p apikey '<apikey>' -p appURL '<triggerProvider>'
```

#### Send Email 
`/whisk.system/sendgrid/sms` create a email and send it to multiply receivers

| **Parameter** | **Type** | **Required** | **Description** | **Default** | **Example** |
| ------------- | ---- | -------- | ------------ | ------- |------- |
| to | *string* | yes |  Number from receiver | - | "XXXXX@XX.com" |
| from | *string* | yes |  Email from sender | - | "YYYYY@YY.com" |
| message | *string* | yes |  Message text content  | - | "ZZZZZ" |
| subject | *string* | no |  Subject of the email | - | "WWWWW" |
| contentType | *string* | no |  Content type of email | text/plain | - |
| cc | *string* | no |  CC header of mail, comma seperated email receivers| - | "test1@example.com,test2@example.com" |

##### Usage

```bash
wsk -v action invoke sendgrid/sendMail -p to 'XXXXX@XX.com' -p from 'YYYYY@YY.com' -p subject 'WWWWW' -p message 'ZZZZZ' -p  cc 'test1@example.com,test2@example.com'
```

Example of success response:
```javascript
{
    "result": "Mail send successful! "
}
```
## Feed
#### Create trigger
`/whisk.system/sendgrid/sendgridFeed` is an action, which handle the trigger lifecycle (create, delete) for Sendgrid Service.
Each trigger must listen on a Sendgrid-based Action, e.g. open, process.
To get a full overview of all supported Sendgrid-based Actions hava a look [here](https://sendgrid.com/docs/API_Reference/Webhooks/event.html)

Independent from the choosen event type, you must configure the callback webhook url in your sendgrid account manually.
The API doesnt provide any functionality to do it.

Move to: Mail Settings -> Event Notification -> HTTP POST URL -> Fullfill webhook request url 
```text
 http://<TriggerProvider>.mybluemix.net/eventincoming
```

  ***Recommondation:*** In chapter "Select Actions" choose "All". It is only possible to define one configuration for the whole sendgrid account.  
 
Now the sendgrid account is able to perform a webhook request to your node application to fire a whisk trigger with Sendgrid-based action details.

| **Parameter** | **Type** | **Required** | **Description** | **Default** | **Example** |
| ------------- | ---- | -------- | ------------ | ------- |------- |
| actionType | *string* | yes |  Sendgrid-based Action | - | "open" |
| feed | *string* | yes |  Feed action | - | "sendgrid/sendgridFeed" |

##### Usage
```bash
wsk trigger create <triggerName> -p actionType 'actionType'  --feed sendgrid/sendgridFeed
```

Example of success response:
```javascript
{
    "result": "done creation"
}

```


# Deploying Locally
This package contains an install script that will create a package and add the actions into it :
```shell
git clone https://github.com/saschoff91/wsk-pkg-sendgrid
cd wsk-pkg-sendgrid
./install.sh <apihost> <authkey> <pathtowskcli>
```

# Further Work
* More actions and functionality must implemented
* Add support of IBM Bluemix Sendgrid Service 
* Implement test cases with real test account
* Implementation is based on a trial account with limited functionality

# Contributing
Please refer to [CONTRIBUTING.md](CONTRIBUTING.md)

# License
Copyright 2015-2016 IBM Corporation

Licensed under the [Apache License, Version 2.0 (the "License")](http://www.apache.org/licenses/LICENSE-2.0.html).

Unless required by applicable law or agreed to in writing, software distributed under the license is distributed on an "as is" basis, without warranties or conditions of any kind, either express or implied. See the license for the specific language governing permissions and limitations under the license.
