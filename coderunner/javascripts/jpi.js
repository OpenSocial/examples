
var JPI = JPI || {}; // Jive persistence interface -- used to store the code in jive
JPI.codeStore = function(){};
JPI.codeStore.prototype ={	
 loadCode : function (){

	osapi.jive.core.documents.get({id:6077}).execute(function(response){
		debugger;
		var document = response.data;
		var docHtml;
		document.html.get().execute(function(response){debugger; console.log(response); docHtml=response});
		debugger;
		console.log(docHtml);
		console.log(response);
		
		});
 	debugger;
  },
  formattedIdentiferText : function(){
	var prependSecretCodeIdentifier = '<div id="vingetteUUID" style="display: none;">This document was created by the Jive Code Runner App. Please do not edit the text in this section! ';
	var vingetteUUID = 'JCR-' + Math.uuid();
	var closingDivTag='</div>';
	return prependSecretCodeIdentifier + vingetteUUID + closingDivTag;	
  },

  formatCode : function(codeString){
	var prependStyle1 = '<pre id="vingetteCode" class="jive_text_macro jive_macro_code" jivemacro="code" ___default_attr="javascript">';
	var closingStyleTag='</pre>';
	formattedCode = JCR.formattedIdentiferText() + prependStyle1 + codeString + closingStyleTag;
	console.log(formattedCode);
	return formattedCode;
  },

  saveCode : function (){
	debugger;
	var formattedHTML = JCR.formatCode($('#codeInput').val());
	console.log(formattedHTML);
	var documentParams = {userId: '@viewer',
	                  subject: 'Test III',
	                  html: formattedHTML,
	                  userURI: ['/users/3020']}
	var request = osapi.jive.core.documents.private.create(documentParams);
	// execute the request
	request.execute(function(data){console.log(data)});   
 },

   loadCodeInput : function(){
	$('#codeInput').text();
 },

     extractCode : function(codeGist){
         console.log("not yet implemented");
     }
}; // End of JPI.codeStore.prototype definition
