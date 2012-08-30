
function loadContent(selection){
	console.log("in load");
	console.log(selection);
};

function initialize(){
	gadgets.actions.updateAction({
	      id:"jiveapps.stackattack.content",
	      callback:loadContent
	  });
};

gadgets.util.registerOnLoadHandler(initialize);