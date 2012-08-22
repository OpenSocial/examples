/**
For complete documentation see:
http://opensocial-resources.googlecode.com/svn/spec/2.0.1/Core-Gadget.xml#gadgets.window.getViewportDimensions
http://opensocial-resources.googlecode.com/svn/spec/2.0.1/Core-Gadget.xml#gadgets.window.getContainerDimensions
*/

function myCallback(data) {
  console.log(data);
  output("Container dimensions: " + gadgets.json.stringify(data)); //method specific to the code runner

};

function request() {
            var domWindow = gadgets.window.getViewportDimensions() ;
			//You'll get a DOMWindow here. Feel free to explore this object. Lots of good stuff on it.
            console.log("Viewport height = " + domWindow.height );
            console.log("Viewport width = " +  domWindow.width );
            output("Viewport height = " + domWindow.height );
            output("Viewport width = " + domWindow.width );

			//This code will get the size of the OpenSocial applicaiton container
            gadgets.window.getContainerDimensions(myCallback);
};


request();