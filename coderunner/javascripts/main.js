/** 
Eventuall, I'd like to add the ability to store a piece of code in Jive as a discussion and let people collaborate around it.
For now though, we'll build out the GIST store
*/
// Jive persistence code store -- used to store the code as jive discussions

// make
output = function(someText){
      // add option to clear text & add time stamp of run
      $("#outputArea").val( $("#outputArea").val() + "\n\n" + someText);
};



var AHI = AHI || {}; // For use with the Jive's apphosting infrastructure
AHI.codeStore = function(){};
AHI.codeStore.prototype = {
	
	loadCode : function (){
        //debugger;
	    var currentCodeExtract = opensocial.data.getDataContext().getDataSet("currentCodeExtract");
 	    var prefs = new gadgets.Prefs();
        var codeUrl = prefs.getString("jiveGistFileRootUrl") + currentCodeExtract.codeUrl;
        //var codeUrl = encodeURI(currentCodeExtract.raw_url);
        // codeUrl = encodeURI(codeUrl);
        console.log(codeUrl);
        osapi.http.get({href:codeUrl, refreshInterval:1}).execute( function(result){
            //TODO: Check for errors and stuff
            //Do we really want to call JCR directly or use a listener on os data context?
            JCR.renderCodePanel(result.content);
        } );
	
	
	},

    indexUrl:function (indexUrlKey, indexFileName, indexFileRootUrl) {
        //probably need to add checks for a well formed url.
        // default value shoud resolve to: http://apphosting.jivesoftware.com/apps/dev/jivegists/gistlist.json
        // var gistUrl = prefs.getString("jiveGistFileRootUrl") + "gistlist.json"; //factor our gistlist to a constant
        //barf. this is ugly. need to fix it.


        var prefs = new gadgets.Prefs();
        indexUrlKey = indexUrlKey || "jiveGistFileRootUrl";
        indexFileName = indexFileName || "codeIndex.json";


        var indexFileRootUrl = prefs.getString(indexUrlKey);

        if (indexFileRootUrl == "") {
             indexFileRootUrl = "http://apphosting.jivesoftware.com/apps/dev/jivegists/";
            prefs.set(indexUrlKey, indexFileRootUrl);
        };

        return indexFileRootUrl + indexFileName;

    },

    loadCodeSummaries : function (){
	//	debugger;
	  	var vwr = opensocial.data.getDataContext().getDataSet('viewer');
        var indexUrl = this.indexUrl();
        osapi.http.get({href:indexUrl, refreshInterval:1}).execute( function(data){
           //store the results from the query to app hosting in the data context
           //console.log("code collection");
 			
		   if (data.content === undefined) 
		       {console.log("No results returned!" ); return;} 

		   opensocial.data.getDataContext().putDataSet("codeCollection",(gadgets.json.parse(data.content).files.sort(function sortfunc(a,b){return (a.name > b.name) ? 1 : -1;})));});
	},


    loadDocSummaries : function (){
        //TODO: refactor into static prperties
        var indexUrl = this.indexUrl("jiveDocListFileRootUrl", "docIndex.json" );
        osapi.http.get({href:indexUrl, refreshInterval:1}).execute( function(data){
           //store the results from the query to app hosting in the data context
           //console.log("code collection");

		   if (data.content === undefined)
		       {console.log("No results returned!" ); return;}
		   opensocial.data.getDataContext().putDataSet("docCollection",(gadgets.json.parse(data.content).files.sort(function sortfunc(a,b){return (a.name > b.name) ? 1 : -1;})));});
	},

	
	extractCode : function(codeGist, renderCollection){
		// Need to add an id here so that we can use it as an id for the divs 
		// name may not be unique	
		codeGist.id = Math.uuid(5, 3);
        renderCollection.push(codeGist);
         }
}; // End of AHI.codeStore.prototype definition

//OK.. ToDo: Remove the hardcoded paths. 


var JCR = JCR || {};

JCR.runCode = function (){
    eval($('#codeInput').val());
};

JCR.renderCodePanel = function(codeString){
    $("#codeInput").val(codeString);
};

JCR.clearOutputArea = function(){
    $("#outputArea").val("");
};

JCR.getExtractedCodeComponentFromSelection = function(event, ui) {
   //Look up the right extractedCode from the os data context and set it as the currentCodeExtract
   var renderCollection = opensocial.data.getDataContext().getDataSet("renderCollection");
   var codeId = ui.newHeader[0].id;

   for (var i = 0; i < renderCollection.length; i++){
       //set the current code context
       //fix the equality check please!
       if (codeId == renderCollection[i].id){
          opensocial.data.getDataContext().putDataSet("currentCodeExtract", renderCollection[i]);
          break;
       };
   };
};


JCR.renderDivs = function (renderCollection, codeCollection){
    //console.log("in render divs");
    //var renderCollection = opensocial.data.getDataContext().getDataSet("extractedCode");
    //Make one big HTML String
    var htmlToRender = "";
    var codeStore = opensocial.data.getDataContext().getDataSet("codeStore");
    for (var i = 0; i < renderCollection.length; i++){htmlToRender = htmlToRender + JCR.buildDivs(renderCollection[i])};
    $('#accordion').prepend(htmlToRender);
    $('#accordion').accordion({
        autoHeight: false});
    opensocial.data.getDataContext().putDataSet("currentCodeExtract",renderCollection[0]);
};


JCR.buildDivs = function(codeComponent){
    // The description is pretty uninteresting. Would like to have the social aspects of gist worked in
    // Get rid of the title. Use the Description as a pretty print
    var h3 = "<h3 id=" + codeComponent.id +"><a href='#'>" + codeComponent.name + "</a></h3>";
    var divTag = "<div><p>" + codeComponent.description + "</p></div>";
    return(h3+divTag);
};

JCR.extractCodeAndBuildDisplayElements = function(){
    //get the code collection
    var codeCollection = opensocial.data.getDataContext().getDataSet("codeCollection");
    var codeStore = opensocial.data.getDataContext().getDataSet("codeStore");
    var renderCollection = new Array();
    for (var i = 0 ; i < codeCollection.length;i++){
        //The extractCode method will call back into this via the buildDivs.
        //This ensures the make request to get the code completes before the divs are built.
        //TODO: if you convert JCR to an object, you'll need to pass it in as a parm
        codeStore.extractCode(codeCollection[i], renderCollection);
    };
    opensocial.data.getDataContext().putDataSet("renderCollection", renderCollection);
    JCR.renderDivs(renderCollection, codeCollection);
};

JCR.refreshCode = function(){
    //simply reload the view
    if (gadgets.views.getCurrentView().name_ == "default")
        gadgets.views.requestNavigateTo("canvas")
    else
        gadgets.views.requestNavigateTo(gadgets.views.getCurrentView().name_);
};

JCR.tabShowEventHandler = function (event, ui) {
	debugger;

    var navTabs = $('#navigationTabs').tabs();
    var selected = navTabs.tabs('option', 'selected'); // => 0

	console.log(event);
	console.log(ui);
	
};

JCR.buildDocIndexDispalyElements = function(){

};

JCR.buildCodeIndexDisplayElements = function() {
 JCR.extractCodeAndBuildDisplayElements();
};


JCR.uiController = function(codeStore){
    var osDataContext = opensocial.data.getDataContext();

	//register listner on data context for code the listener invokes a method that builds the divs for each of the entries
	osDataContext.registerListener('codeCollection', JCR.buildCodeIndexDisplayElements);

    //register a listener on the current code that is being displayed in the code pane
	osDataContext.registerListener("currentCodeExtract", codeStore.loadCode);


    //document Handler
	//register listner on data context for code the listener invokes a method that builds the divs for each of the entries
	osDataContext.registerListener('docCollection', JCR.buildDocIndexDispalyElements);


    //Bind the UI Controls
    $("#refreshCode").bind("click",JCR.refreshCode);
//	$("#saveCode").bind("click",codeStore.saveCode);
    $("#runCode").bind("click",JCR.runCode);
    $('#accordion').bind('accordionchangestart', JCR.getExtractedCodeComponentFromSelection);
    $('#accordion').bind('accordionchangestart', JCR.clearOutputArea);


	//Bind to the show event by type: tabsshow.
	$( "#navigationTabs" ).bind( "tabsshow", JCR.tabShowEventHandler);

    //Load the code summaries to populate the code accordion
    codeStore.loadCodeSummaries();
    codeStore.loadDocSummaries();
};

 

gadgets.util.registerOnLoadHandler(function() {
// debugger;
   var codeStore =  new AHI.codeStore();
   opensocial.data.getDataContext().putDataSet("codeStore",codeStore);
   $( "#navigationTabs" ).tabs();
   controller = new JCR.uiController(codeStore);
   console.log(controller);
   gadgets.window.adjustHeight(750);
});
