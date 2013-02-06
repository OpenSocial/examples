
var template = Hogan.compile($.trim($("#activity_tmpl").text()));

var social = new OpenSocialWrapper();

social.loadActivityEntries(function(data) {
  var activities = data.viewerEntries.list.concat(data.ownerEntries.list, data.friendEntries.list);
  for (var i = 0; i < activities.length; i++) {
    var context = activities[i];
    context.published = prettyDate(context.published);
    var rendered = template.render(context);
    $("#activity-stream").append(rendered);

    if (context.openSocial && context.openSocial.embed) {
      var closure = handleEE(context.openSocial.embed);
      $("#activity-stream > :last").click(closure);
    }  
  };
})

function handleEE(dataModel) {
  return function() {
    var resultCallback = function() {};
    var navigateCallback = function() {};
    var opt_params = {
      "viewTarget" : "modal_dialog",
      "coordinates" : {
        "left": "1",
        "right": "1",
        "top": "1",
        "bottom": "1"
      }
    };
    gadgets.views.openEmbeddedExperience(resultCallback, navigateCallback, dataModel, opt_params);
 }   
}

