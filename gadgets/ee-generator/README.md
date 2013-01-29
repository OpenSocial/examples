# Embedded Experience Generator

## Project
This is a [maven](http://maven.apache.org/guides/getting-started/index.html) project 
that produces an executable jar file to send embedded experience emails.

You can use [eclipse](http://eclipse.org) and the [m2e](http://eclipse.org/m2e/) plugin to build it.  You can also edit the 
example to alter the content of the emails or the gadget to use for the Embedded Experience.

## Running the sample
The sample java application reads in some config about the mail server to use from the system properties.  
Required:
* mail.smtp.host
* mail.from
* mail.to

Optional:
* mail.smtp.port
* mail.smtp.auth
* mail.smtp.auth.username
* mail.smtp.auth.password

You can specify these on the command line like so:
linux:  
```
java -Dmail.smtp.host=smtp.example.com \
     -Dmail.from=from@example.com \
     -Dmail.to=to@example.com \
     -Dmail.smtp.port=587 \
     -Dmail.smtp.auth=true \
     -Dmail.smtp.auth.username=from@example.com \
     -Dmail.smtp.auth.password=user-password \
     -Dmail.subject="subject" \
     -Dmail.parts.plain="content" \
     -Dmail.parts.html="<b>content</b>" \
     -Dmail.parts.ee="{\"gadget\":\"http://gadget.com\",\"context\":{}}" \
     -jar ee-generator-1.0.0-SNAPSHOT-jar-with-dependencies.jar
```   
         
windows:  
```
java -Dmail.smtp.host=smtp.example.com ^
     -Dmail.from=from@example.com ^
     -Dmail.to=to@example.com ^
     -Dmail.smtp.port=587 ^
     -Dmail.smtp.auth=true ^
     -Dmail.smtp.auth.username=from@example.com ^
     -Dmail.smtp.auth.password=user-password ^
     -Dmail.subject="subject" ^
     -Dmail.parts.plain="content" ^
     -Dmail.parts.html="<b>content</b>" ^
     -Dmail.parts.ee="{\"gadget\":\"http://gadget.com\",\"context\":{}}" ^
     -jar ee-generator-1.0.0-SNAPSHOT-jar-with-dependencies.jar
```