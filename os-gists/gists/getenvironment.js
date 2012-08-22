/**
getenvironment.js
For complete documentation see:
http://opensocial-resources.googlecode.com/svn/spec/trunk/Social-Gadget.xml#opensocial.getEnvironment
*/

function request() {
  var env = opensocial.getEnvironment();
  console.log(env);
  output(gadgets.json.stringify(env));
};
request();