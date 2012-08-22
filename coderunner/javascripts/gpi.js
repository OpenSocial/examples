
// Jive persistence code store -- used to store the code as jive discussions
var GPI = GPI || {}; // Jive persistence interface -- used to store the code in jive
GPI.codeStore = function(){};
GPI.codeStore.prototype = {
    //unfortunately, gist requires a patch. can't do this now.
    saveCode : function () {
        console.log("in save");
        debugger;
    },

    loadCode : function (){

        var currentCodeExtract = opensocial.data.getDataContext().getDataSet("currentCodeExtract");
        console.log("in loadCode");
        debugger;
        var codeUrl = 'https://raw.github.com/gist/' + currentCodeExtract.id + '/' + currentCodeExtract.name;
        //var codeUrl = encodeURI(currentCodeExtract.raw_url);
        // codeUrl = encodeURI(codeUrl);

        console.log(codeUrl);
        debugger;

        osapi.http.get({href:codeUrl, nocache:"true"}).execute( function(result){
            //TODO: Check for errors and stuff
            //Do we really want to call JCR directly or use a listener on os data context?
            debugger;
            JCR.renderCodePanel(result.content);
        } );
    },

	loadCodeSummaries : function (){
		var prefs = new gadgets.Prefs();
		var gistId = prefs.getString("gistUserId");
		var vwr = opensocial.data.getDataContext().getDataSet('viewer');
		//if (gistId == "") {gistId = vwr.name.formatted};
        if (gistId == "") {gistId = "markweitzel"}; //for now until better error handling on new gist users
		//todo: add error handling for name not found
	    var gistUrl = "https://api.github.com/users/" + gistId +"/gists";
        osapi.http.get({href:gistUrl, nocache:"true"}).execute( function(data){
            //store the results from the query to github in the data context
            debugger;
            opensocial.data.getDataContext().putDataSet("codeCollection",(gadgets.json.parse(data.content)));
           //console.log("code collection");
           //console.log(opensocial.data.getDataContext().getDataSet("codeCollection"))
           }
       );
    },

    extractCode : function(codeGist, renderCollection){
        var codeComponents = {};
        var gistFiles = codeGist.files;
        for (item in codeGist.files) {
            console.log("item");
            console.log(item);
            //TODO: This assumes all gists are javascript and can be run in the code runner. May want to add an additional check.
            // e.g. if language = jaavascript
            if (codeGist.files.hasOwnProperty(item)) {
                codeComponents.name = item ;
                codeComponents.description = codeGist.description;
                codeComponents.id = codeGist.id;
                codeComponents.codeUrl = codeGist.files[item].raw_url;
                renderCollection.push(codeComponents);
             };
         };
    }
}; // End of GPI.codeStore.prototype definition