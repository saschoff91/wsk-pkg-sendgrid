#!/bin/bash

set -e
set -x

if [ $# -eq 0 ]
then
    echo "Usage: ./install.sh $APIHOST $AUTH $WSK_CLI"
fi

APIHOST="$1"
AUTH="$2"
WSK_CLI="$3"

PACKAGE_HOME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo Installing a Sendgrid Package  \

$WSK_CLI --apihost $APIHOST package update --auth $AUTH --shared yes  sendgrid \
    -a description "Openwhisk Package Sendgrid" \
    -a parameters '[{"name":"apiKey","required":true,"bindTime":true,"description":"Sendgrid account apikey"}]'

$WSK_CLI --apihost $APIHOST action update --auth $AUTH --shared yes sendgrid/sendMail $PACKAGE_HOME/actions/sendMail.js \
-a description 'Send Mail to receiver' \
    -a parameters '[{"name":"apikey","required":true,"bindTime":true,"type":"password","description":"Sendgrid account api key"},{"name":"to","required":true,"bindTime":false,"description":"Email from receiver"},{"name":"from","required":true,"bindTime":false,"description":"Email from sender"},{"name":"message","required":true,"bindTime":false,"description":"Email content"},{"name":"subject","required":false,"bindTime":false,"description":"Mail subject"},{"name":"contentType","required":false,"bindTime":false,"description":"Email contentType, e.g. text/plain"},{"name":"cc","required":false,"bindTime":false,"description":"Comma seperated list of receiver emails"}]'    \
    -a sampleInput '{"apikey":"XXXXXX","to":"YYYYYY","from":"WWWWWW","subject":"UUUUUU","message":"ZZZZZZ","cc":"receiver1@example.de, receiver2@example.de, receiver3@example.de"}' \
-a sampleOutput '{"result": "Mail send successful! "}'
