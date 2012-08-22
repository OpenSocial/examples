/**
Get Viewer Friends
For complete documentation see:
(http://opensocial-resources.googlecode.com/svn/spec/2.0.1/Social-Gadget.xml#osapi.people.getViewerFriends)
*/

function response(data) {
  console.log(data);
  output(gadgets.json.stringify(data)); //method specific to the code runner
  gadgets.window.adjustHeight();
};

function request() {
  osapi.people.getViewerFriends().execute(response);
};

request();