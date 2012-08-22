/**
Work with custom user preferences
There are two user preferences in the jivecr2 app.xml. If you open the
settings on the app, you'll see them. This jive gist works with both of those.
(http://opensocial-resources.googlecode.com/svn/spec/trunk/Core-Gadget.xml#gadgets.Prefs)
*/

var stringKey = "testUserPref-string";
var booleanKey = "testUserPref-boolean";

//Step 0 - Run this code
request();

//Step 1 - Open up the place picker
function request() {
    var prefs = new gadgets.Prefs();
    var testString = prefs.getString(stringKey);
    var testBoolean = prefs.getBool(booleanKey);

    output("Getting the initial saved values");
    writeOutput(testString, testBoolean);
    output("Setting the values");


    prefs.set(stringKey, "This is a test of setting the values");
    prefs.set(booleanKey, true);
    testString = prefs.getString(stringKey);
    testBoolean = prefs.getBool(booleanKey);
    output("Writing after the programmatic setting of the prefs");
    writeOutput(testString, testBoolean);

};

//Utility Functions
function writeOutput(aString, aBoolean){
    output(stringKey + " " + aString);
    output(booleanKey + " " + aBoolean);

};