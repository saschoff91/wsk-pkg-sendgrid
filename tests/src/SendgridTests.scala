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

package packages

import common._
import org.junit.runner.RunWith
import org.scalatest.Matchers
import org.scalatest.junit.JUnitRunner
import spray.json._
import spray.json.DefaultJsonProtocol.StringJsonFormat
import scala.collection.immutable.HashMap
import org.scalatest.FlatSpecLike

@RunWith(classOf[JUnitRunner])
class SendgridTests extends TestHelpers with WskTestHelpers with Matchers {

  implicit val wskprops = WskProps()
  val wsk = new Wsk()

  val sendgridCredentials = TestUtils.getVCAPcredentials("sendgrid")
  val apikey = sendgridCredentials.get("apikey");
  val appURL = sendgridCredentials.get("appURL");

  val cloudantCredentials = TestUtils.getVCAPcredentials("cloudantNoSQLDB")
  val username = cloudantCredentials.get("username");
  val password = cloudantCredentials.get("password");
  val host = cloudantCredentials.get("host");
  val port = cloudantCredentials.get("port");
  val url = cloudantCredentials.get("url");

  behavior of "Sendgrid Package"

  "send mail" should "return, send successfull!" in {
    val actionName = "/whisk.system/sendgrid/mail"
    val params = HashMap("apikey" -> apikey.toJson, "to" -> "saschoff@de.ibm.com".toJson, "from" -> "saschoff@de.ibm.com".toJson, "message" -> "Test Message from wsk-pkg-sendgrid".toJson);

    withActivation(wsk.activation, wsk.action.invoke(actionName, params)) {
      _.fields("response").toString should include(s""""Mail send successful!"""")
    }
  }
}
