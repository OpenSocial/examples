var progress = new XhrProgress('progress_bar');

shindig = shindig || {};
shindig.xhrwrapper = {
  createXHR : progress.createXhr
}

Handlebars.registerPartial('header', $("#activity_header").html());
Handlebars.registerPartial('footer', $("#activity_footer").html());
var text_template = Handlebars.compile($("#activity_body_txt").html());

Handlebars.registerHelper('getAvatarProperties', function(actor){
  return actor.image ? 'src="' + actor.image.url +'" height="' + actor.image.height + '" width="' + actor.image.width + '" ' : " src=error.png ";  
})
Handlebars.registerHelper('formatPredicateClause', formatPredicateClause);

var social = new OpenSocialWrapper();
progress.setProgress(25);
social.loadActivityEntries(function(data) {
  var activities = data.list;
  var $stream=$("<div></div>");
  for (var i = 0; i < activities.length; i++) {
    var context = activities[i];
    context.published = prettyDate(context.published);
    $stream.append(text_template(context));

    if (context.openSocial && context.openSocial.embed) {
      var closure = handleEE(context.openSocial.embed, context);
      $("#ee_" + context.id).live('click', closure);
    }  
  };
  $("#activity-stream").html($stream);
});

function getArticle(obj) {
  return /^[aeiou].*$/.test(obj) ? "an " : "a ";
}

function getPastTense(obj) {
  return obj + (/^.*e$/.test(obj) ? "d" : "ed");
}

function handleEE(dataModel, item) {
  return function() {
    var resultCallback = function() {};
    var navigateCallback = function() {};
    var opt_params = {};
    if(dataModel.preferredExperience && dataModel.preferredExperience.target) {
      var target = dataModel.preferredExperience.target;
      opt_params.viewTarget=target.viewTarget;
      opt_params.view=target.view;
    } else {
      opt_params.viewTarget = "modal_dialog";
    }
    dataModel.context.openSocial = dataModel.context.openSocial || {};
    dataModel.context.openSocial.associatedContext = item;
    gadgets.views.openEmbeddedExperience(resultCallback, navigateCallback, dataModel, opt_params);
 }   
}

function formatPredicateClause(verb, object) {

  var clause="";
  switch(verb) {
    case "at":
      clause="was at";
      break;
    case "read":
      clause= "read";
      break;
    case "build":
      clause= "built";
      break;
    case "checkin":
      clause= "checked in";
      break;
    case "deny":
      clause= "denied";
      break;
    case "find":
      clause= "found";
      break;
    case "flag-as-inappropriate":
      return "flagged " + object.displayName ? object.displayName : getArticle() + object.objectType+ " as inappropriate";
    case "give":
      clause= "gave";
      break;
    case "leave":
      clause= "left";
      break;
    case "lose":
      clause= "lost";
      break;
    case "make-friend":
      clause= "friended";
      break;
    case "qualify":
      clause= "qualified";
      break;
    case "request-friend":
      return "requested that " + object.displayName ? object.displayName : object.id + " add them as a friend";
    case "rsvp-maybe":
      clause= "RSVP'd maybe to";
      break;
    case "rsvp-no":
      clause= "RSVP'd no to";
      break;
    case "rsvp-yes":
      clause= "RSVP'd yes to";
      break;    
    case "satisfy":
      clause= "satisfied";
      break;
    case "send":
      clause= "sent";
      break;
    case "stopped-following":
      return "stopped following " + object.displayName ? object.displayName : object.id;
    case "submit":
      clause= "submitted";
      break;
    case "tag":
      clause="tagged";
      break;
    case "unsatisfy":
      clause="unsatisfied";
      break;
    case "win":
      clause="won";
      break;
    default:
      clause=getPastTense(verb);
  }
  return clause + " " + getArticle(object.objectType) + " " + getObjectTypeClause(object);
}

function getObjectTypeClause(type) {
  if(type.objectType == "collection") {
    return "collection of " + (type.objectTypes ? type.objectTypes.join(",") : "items")
  } else {
    return type.objectType;
  }

}



