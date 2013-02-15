(function() {

  var interval, lastRendered=null, firstRendered, $streamWrapper,loaded=false, textTemplate, imgTemplate, emptyTemplate, social = new OpenSocialWrapper(), progress=new XhrProgress('progress_bar', 10), prefs=new gadgets.Prefs(), refreshInterval=parseInt(prefs.getString("refresh_interval"))*1000, maxItems=parseInt(prefs.getString("max_items")); 
  shindig = shindig || {};
  shindig.xhrwrapper = {
    createXHR : progress.createXhr
  }

  gadgets.util.registerOnLoadHandler(function() {
    $streamWrapper=$("#activity-stream");
    Handlebars.registerPartial('embedded', $("#activity_embedded").html());
    Handlebars.registerPartial('header', $("#activity_header").html());
    Handlebars.registerPartial('footer', $("#activity_footer").html());
    textTemplate = Handlebars.compile($("#activity_body_txt").html());
    imgTemplate = Handlebars.compile($("#activity_body_img").html());
    emptyTemplate = Handlebars.compile($("#activity_body_empty").html());

    Handlebars.registerHelper('getAvatarProperties', function(actor){
      return actor.image ? 'src="' + actor.image.url +'" height="' + actor.image.height + '" width="' + actor.image.width + '" ' : " src=error.png ";  
    })
    Handlebars.registerHelper('formatPredicateClause', formatPredicateClause);
    progress.setProgress(25);
    var activityFn = gadgets.views.getCurrentView().getName().toUpperCase() == gadgets.views.ViewType.PROFILE ? function() { social.loadOwnerActivityEntries(render); } : function() { social.loadActivityEntries(render); };
    activityFn();
    interval = setInterval(activityFn, refreshInterval);
  });

  function render(data) {
    var activities = data.list;
    var $stream=$("<div></div>");
    if(activities.length == 0) {
      if(!loaded) $streamWrapper.html(emptyTemplate());  
    } else {
      if(firstRendered==null || firstRendered != activities[0].id) {
        $streamWrapper.fadeOut(200);
        setTimeout(function(){ 
          renderActivities($stream, activities);
          $streamWrapper.html($stream);
          $streamWrapper.fadeIn(50);
          resize();
        }, 200);
      }
    }
    loaded=true;
  }

  function renderActivities($stream, activities) {  
    var length = activities.length < maxItems ? activities.length : maxItems;
    for (var i = 0; i < length; i++) {
      var context = activities[i];
      context.published = prettyDate(new Date(context.published).toISOString());
      var template=getTemplateForObject(context.object);
      $stream.append(template(context));

      if (context.openSocial && context.openSocial.embed) {
        var closure = handleEE(context.openSocial.embed, context);
        $("#ee_" + context.id).live('click', closure);
      }  
    }
    firstRendered = activities[0].id;
    lastRendered = activities[length-1].id;
  }

  function getTemplateForObject(obj) {
    return obj.image ? imgTemplate : textTemplate;
  }

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
      if(typeof dataModel.context == "object") {
        dataModel.context.openSocial = dataModel.context.openSocial || {};
        dataModel.context.openSocial.associatedContext = item;
      }
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
        return "connected with " + getObjectTypeClause(object);
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
    switch(type.objectType) {
      case "collection": 
        return "collection of " + (type.objectTypes ? type.objectTypes.join(",") : "items");
      case "person": 
        return type.displayName ? type.displayName : type.id;
      default:
        return type.objectType;
    }
  }
  function resize() { 
    var resizeInterval = null;
    var fn = function() {
      if(document.getElementById(lastRendered)) {
        gadgets.window.adjustHeight();
        if(resizeInterval != null) {
          clearInterval(resizeInterval);
        }
      }
    }
    resizeInterval = setInterval(fn, 50)
  }

})();


