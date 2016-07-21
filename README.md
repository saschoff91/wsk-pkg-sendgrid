Openwhisk Sendgrid Package
============================

This repository includes actions and feeds for [IBM Bluemix](http://www.ibm.com/cloud-computing/bluemix/) service Sendgrid. 

The whole communication is based on the [Twilio REST API](https://www.twilio.com/docs/api/rest).

## Getting Started:
Before using this package, following preparations must be done:
  1. Create a [Sendgrid](sendgrid.com) account to get the apikey from [here](https://app.sendgrid.com/settings/api_keys)
  2. Create a general apikey if it's not existing and assign permissions to it.

| Entity | Type | Parameters | Description |
| --- | --- | --- | --- |
| `/whisk.system/sendgrid` | package | apikey | Sendgrid Package |
| `/whisk.system/twilio/sendMail` | action | see action [details](https://github.com/saschoff91/wsk-pkg-sendgrid/blob/master/actions/sendMail.js) | send mail to multiply receiver |



## Actions:
To bind parameters to the package perform following command.
```bash
wsk package update sendgrid -p apikey '<apikey>'
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


# Deploying Locally
This package contains an install script that will create a package and add the actions into it :
```shell
git clone https://github.com/saschoff91/wsk-pkg-sendgrid
cd wsk-pkg-sendgrid
./install.sh <apihost> <authkey> <pathtowskcli>
```

# Further Work
* Replace the restful api communication to sendgrid node library, [pull request](https://github.com/openwhisk/openwhisk/pull/829) already exist
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
