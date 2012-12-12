
var template = Hogan.compile($.trim($("#activity_tmpl").text()));
var social = new OpenSocialWrapper();

require(['types/activity'], function(Activity) {
  social.loadActivityEntries(function(data) {

    for (var i = 0; i < data.viewerEntries.list.length; i++) {
      var context = data.viewerEntries.list[i];
      var activity = new Activity(context);

      if (activity.isValid()) {
        context.published = prettyDate(context.published);
        context.verbTense = conjugateVerb(context.verb);
        var rendered = template.render(context);
        $("#activity-stream").append(rendered);

        if (context.openSocial && context.openSocial.embed) {
          var closure = handleEE(context.openSocial.embed);
          $("#activity-stream > :last").click(closure);
        }
      } else {
        gadgets.error("Attempted to render invalid activity stream entry.");
      }
    };
  });
});

var conjugateVerb = function(verb) {
  return "posted";
};

function handleEE(dataModel) {
  return function() {
    var resultCallback = function() {};
    var navigateCallback = function() {};
    var opt_params = {
      "viewTarget" : "modal",
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

