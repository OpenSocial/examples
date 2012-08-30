

function buildTableRow(question){
	var tableRow = '<tr><td>^display_name^</td><td>^title^</td></tr>';
	tableRow = tableRow.replace("^display_name^", question.owner.display_name);
	tableRow = tableRow.replace("^title^", question.title);
	return tableRow;
};


function outputQuestions(response){
	$("#tableCaption").text("Search Results for " + $("#searchTerm").val());
	var questions = JSON.parse(response.content);
	console.log(questions);
	
	for (var i = questions.items.length - 1; i >= 0; i--){
		$('#tableBody').append(buildTableRow(questions.items[i]));
	};
	gadgets.window.adjustHeight();
	
};


function doSearch(){

	var baseUrl = "https://api.stackexchange.com/2.0/search?site=stackoverflow&sort=creation&order=desc&intitle=";
	var searchTerm = $("#searchTerm").val();
	var searchUrl = baseUrl + searchTerm;
	var params1 = {
	'headers': {'Content-Type': ['application/json;charset=utf-8'],'Accept-Encoding':['GZIP']},
	'href' : searchUrl
    };
    osapi.http.get(params1).execute(outputQuestions);
};

function dumpResponse(response){
	console.log("Response is " + JSON.stringify(response));
};

function dumpContext(key){
	console.log("Value at " + key);
	console.log( JSON.stringify(opensocial.data.getDataContext().getDataSet(key)) );
};

gadgets.util.registerOnLoadHandler(function() {
    $("#searchButton").bind("click",doSearch);

/*
   var params1 = {
	'headers': {'Content-Type': ['application/json;charset=utf-8'],'Accept-Encoding':['GZIP']},
	'href' : 'https://api.stackexchange.com/2.0/tags?site=stackoverflow'
    };

    osapi.http.get(params1).execute(dumpResponse);
	dumpContext("stackoverflowInfo");
	dumpContext("stackoverflowUsers");
*/
	gadgets.window.adjustHeight();
});
