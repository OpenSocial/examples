

define('types/types',[], function() {

  var Types = {
    "date-time" : "date-time",
    "string" : "string",
    "int" : "int",
    "object" : "object",
    "mediaLink": "mediaLink"
  };

  return Types;

});


define('types/string',['types/types'], function(Types) {

  var ASString = function(value) {
    var type = Types.string;

    var getValue = function() {
      return value;
    };

    var getType = function() {
      return type;
    };

    var hasValue = function() {
      return !!value;
    };

    var isValid = function() {
      return typeof value == 'string';
    };

    return {
      getValue: getValue,
      getType: getType,
      hasValue: hasValue,
      isValid: isValid
    };
  }

  return ASString;

})
;

define('types/array',['types/types'], function(Types) {
  var ActivityArray = function(arr, constructor) {
    var type = Types.array;

    if (typeof constructor == 'undefined') {
      console.log("Error: Constructor was undefined");
      // just use the identify function
    }

    // hack, too lazy to refactor
    var oArr = arr;

    var wrapElements = function(elements) {
      if (!elements || elements.length === 0) {
        return [];
      } else {
        var wrappedElements = [];
        for (var i = 0; i < elements.length; i++) {
          var element = elements[i];
          wrappedElements.push(constructor(element));
        };
      }
      return wrappedElements;
    };

    var arr = wrapElements(arr);

    var getType = function() {
      return type;
    };

    var getValue = function() {
      return arr;
    };

    var hasValue = function() {
      return !!oArr;
    };

    var isValid = function() {
     if (!(arr instanceof Array)) {
      return false;
    } else if (arr.length === 0) {
      return true;
    } else {
      var arrType = arr[0].getType();
      for (var i = 0; i < arr.length; i++) {
        var el = arr[i];
        if (el.getType() != arrType) {
          return false;
        }
      }
      // validate all elements of the array
      var valid = true;
      for (var i = 0; i < arr.length; i++) {
        var el = arr[i];
        var valid = valid && el.isValid();
      }
    }
    return valid;
  };

  return {
    getType: getType,
    getValue: getValue,
    hasValue: hasValue,
    isValid: isValid
  };
};

  return ActivityArray;

});

define('types/int',['types/types'], function(Types) {
  var ASInt = function(value) {
    var type = Types.int;

    var getValue = function() {
      return value;
    };

    var getType = function() {
      return type;
    };

    var hasValue = function() {
      return !!value;
    };

    var isValid = function() {
      var parsed = parseInt(value);
      return !isNaN(parsed);
    };

    return {
      getValue: getValue,
      getType: getType,
      hasValue: hasValue,
      isValid: isValid
    };
  };

  return ASInt;

});



define('types/level',[], function() {
  var Level = {
    "required" : "required",
    "recommended" : "recommended",
    "optional" : "optional"
  };

  return Level;
});


define('types/property',['types/level'], function(Level) {

  var Property = function(name, value, level) {

    var getName = function() {
      return name;
    };

    var isEmpty = function(obj) {
      for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
          return false;
      }
      return true;
    };

    var getValue = function() {
      if (value.hasValue()) {
        return value.getValue();
      } else {
        return null;
      }
    };

    var getLevel = function() {
      return level;
    };

    var hasValue = function() {
      return value.hasValue();
    };

    var isValid = function() {
      var hasValue = value.hasValue();
      if (!hasValue && level == Level.required) {
        return false;
      } else if (!hasValue && level == Level.recommended) {
        console.log("Warning: Missing recommended property: " + name);
        return true;
      } else {
        return !hasValue || value.isValid();
      }
    };

    return {
      getName: getName,
      getValue: getValue,
      getLevel:getLevel,
      hasValue: hasValue,
      isValid: isValid
    };
  };

  return Property;

});

define('types/baseMediaLink',['types/types', 'types/int', 'types/string', 'types/level', 'types/property'], 
  function(Types, ActivityInt, ActivityString, Level, Property) {

    var BaseMediaLink = function() {

      var type = Types.mediaLink;
      var duration = new Property("duration", null, Level.optional);
      var height = new Property("height", null, Level.optional);
      var url = new Property("url", null, Level.required);
      var width = new Property("width", null, Level.optional);

      var getType = function() {
        return type;
      }

      var getDuration = function() {
        return duration;
      };

      var getHeight = function() {
        return height;
      };

      var getUrl = function() {
        return url;
      };

      var getWidth = function() {
        return width;
      };

      var hasValue = function() {
        return false;
      };

      var isValid = function() {
        return true;
      }

      return {
        getType: getType,
        getDuration: getDuration,
        getHeight: getHeight,
        getUrl: getUrl,
        getWidth: getWidth,
        hasValue: hasValue,
        isValid: isValid
      };
    };

    return BaseMediaLink;

  });

define('types/medialink',['types/types', 'types/int', 'types/string', 'types/level', 'types/property', 'types/baseMediaLink'], 
  function(Types, ActivityInt, ActivityString, Level, Property, BaseMediaLink) {

    var MediaLink = function(value) {

  if (!value) {
    return new BaseMediaLink();
  }

  var type = Types.mediaLink;
  var duration = new Property("duration", new ActivityInt(value.duration), Level.optional);
  var height = new Property("height", new ActivityInt(value.height), Level.optional);
  var url = new Property("url", new ActivityString(value.url), Level.required);
  var width = new Property("width", new ActivityInt(value.width), Level.optional);

  var getType = function() {
    return type;
  }

  var getDuration = function() {
    return duration;
  };

  var getHeight = function() {
    return height;
  };

  var getUrl = function() {
    return url;
  };

  var getWidth = function() {
    return width;
  };

  // need to satify the interface
  var getValue = function() {
    return {
      isValid: isValid
    };
  };

  var hasValue = function() {
    return !!value;
  };

  var isValid = function() {
    return duration.isValid() &&
    height.isValid() &&
    url.isValid() &&
    width.isValid();
  }

  return {
    getType: getType,
    getDuration: getDuration,
    getHeight: getHeight,
    getUrl: getUrl,
    getWidth: getWidth,
    hasValue: hasValue,
    isValid: isValid
  };
}

  return MediaLink;

  })
;

define('types/datetime',['types/types'], function(Types) {

  var DateTime = function(datetime) {
    var type = Types.datetime;

    var getType = function() {
      return type;
    };

    var hasValue = function() {
      return !!datetime;
    };

    var isValid = function() {
      return true;
    };

    return {
      getType: getType,
      hasValue: hasValue,
      isValid: isValid
    };
  };

  return DateTime;

});


define('types/baseObject',['types/property', 'types/level'], function(Property, Level) {

  var BaseActivityObject = function() {

  var attachments = new Property("attachments", null, Level.optional);
  var author = new Property("author", null, Level.optional);
  var content = new Property("content", null, Level.optional);
  var displayName = new Property("displayName", null, Level.optional);
  var downstreamDuplicates = new Property("downstreamDuplicates", null, Level.recommended);
  var id = new Property("id", null, Level.recommended);
  var image = new Property("image", null, Level.optional);
  var objectType = new Property("objectType", null, Level.optional);
  var published = new Property("published", null, Level.optional);
  var summary = new Property("summary", null, Level.optional);
  var updated = new Property("updated", null, Level.optional);
  var upstreamDuplicates = new Property("upstreamDuplicates", null, Level.recommended);
  var url = new Property("url", null, Level.optional);
  
  var getAttachments = function() {
    return attachments;
  };

  var getAuthor = function() {
    return author;
  };

  var getContent = function() {
    return content;
  };

  var getDisplayName = function() {
    if (!object.displayName && object.objectType) {
      // the object should specify a display name
    } else {
      return object.displayName;
    }
  };

  var getDownstreamDuplicates = function() {
    return downstreamDuplicates;
  };

  var getId = function() {
    return id.getValue() ? id : url;
  };

  var getImage = function() {
    return image;
  };

  var getObjectType = function() {
    return objectType.getValue();
  };

  var getPublished = function() {
    return published;
  };

  var getSummary = function() {
    return summary;
  };

  var getUpdated = function() {
    return updated;
  };

  var getUpstreamDuplicates = function() {
    return upstreamDuplicates;
  };

  var getUrl = function() {
    return url;
  };

  // need to satify the interface
  var getValue = function() {
    return {
      isValid: isValid
    };
  };

  var hasValue = function() {
    return false;
  };

  var getType = function() {
    return getObjectType();
  };

  var isValid = function() {
    return true;
  };

  return {
    getUrl: getUrl,
    getUpdated: getUpdated,
    getSummary: getSummary,
    getPublished: getPublished,
    getImage: getImage,
    getId: getId,
    getContent: getContent,
    getAuthor: getAuthor,
    getAttachments: getAttachments,
    getUpstreamDuplicates: getUpstreamDuplicates,
    getObjectType: getObjectType,
    getDownstreamDuplicates: getDownstreamDuplicates,
    getDisplayName: getDisplayName,
    getValue: getValue,
    hasValue: hasValue,
    getType: getType,
    isValid: isValid
  };
};

  return BaseActivityObject;

});



define('types/object',['types/object', 'types/string', 'types/array', 'types/medialink', 'types/datetime', 'types/property', 'types/level', 'types/baseObject'], 
  function(ActivityObject, ActivityString, ActivityArray, MediaLink, DateTime, Property, Level, BaseActivityObject) {

    var ActivityObject = function(object) {
      if (!object) {
        return new BaseActivityObject();
      }
      var attachments = new Property("attachments", new ActivityArray(object.attachments, ActivityObject), Level.optional);
      var author = new Property("author", new ActivityObject(object.author), Level.optional);
      var content = new Property("content", new ActivityString(object.content), Level.optional);
      var displayName = new Property("displayName", new ActivityString(object.displayName), Level.optional);
      var downstreamDuplicates = new Property("downstreamDuplicates", new ActivityArray(object.downstreamDuplicates, ActivityString), Level.recommended);
      var id = new Property("id", new ActivityString(object.id), Level.recommended);
      var image = new Property("image", new MediaLink(object.image), Level.optional);
      var objectType = new Property("objectType", new ActivityString(object.objectType), Level.optional);
      var published = new Property("published", new DateTime(object.published), Level.optional);
      var summary = new Property("summary", new ActivityString(object.summary), Level.optional);
      var updated = new Property("updated", new DateTime(object.updated), Level.optional);
      var upstreamDuplicates = new Property("upstreamDuplicates", new ActivityArray(object.upstreamDuplicates, ActivityString), Level.recommended);
      var url = new Property("url", new ActivityString(object.url), Level.optional);

      var getAttachments = function() {
        return attachments;
      };

      var getAuthor = function() {
        return author;
      };

      var getContent = function() {
        return content;
      };

      var getDisplayName = function() {
        if (!object.displayName && object.objectType) {
      // the object should specify a display name
    } else {
      return object.displayName;
    }
  };

  var getDownstreamDuplicates = function() {
    return downstreamDuplicates;
  };

  var getId = function() {
    return id.getValue() ? id : url;
  };

  var getImage = function() {
    return image;
  };

  var getObjectType = function() {
    return objectType.getValue();
  };

  var getPublished = function() {
    return published;
  };

  var getSummary = function() {
    return summary;
  };

  var getUpdated = function() {
    return updated;
  };

  var getUpstreamDuplicates = function() {
    return upstreamDuplicates;
  };

  var getUrl = function() {
    return url;
  };

  // need to satify the interface
  var getValue = function() {
    return {
      isValid: isValid
    };
  };

  var hasValue = function() {
    return !!object;
  };

  var getType = function() {
    return ""; //Types.object;
  };

  var isValid = function() {
    return attachments.isValid() &&
    author.isValid() &&
    content.isValid() &&
    displayName.isValid() &&
    downstreamDuplicates.isValid() &&
    id.isValid() &&
    image.isValid() &&
    objectType.isValid() &&
    published.isValid() &&
    summary.isValid() &&
    updated.isValid() &&
    upstreamDuplicates.isValid() &&
    url.isValid();
  };

  return {
    getUrl: getUrl,
    getUpdated: getUpdated,
    getSummary: getSummary,
    getPublished: getPublished,
    getImage: getImage,
    getId: getId,
    getContent: getContent,
    getAuthor: getAuthor,
    getAttachments: getAttachments,
    getUpstreamDuplicates: getUpstreamDuplicates,
    getObjectType: getObjectType,
    getDownstreamDuplicates: getDownstreamDuplicates,
    getDisplayName: getDisplayName,
    hasValue: hasValue,
    getValue: getValue,
    getType: getType,
    isValid: isValid
  };
};

return ActivityObject;

})
;

define('types/activity',['types/object', 'types/string', 'types/medialink', 'types/datetime', 'types/property', 'types/level'], 
  function(ActivityObject, ActivityString, MediaLink, DateTime, Property, Level) {

    var Activity = function(activity) {
      var actor = new Property("actor", new ActivityObject(activity.actor), Level.required);
      var content = new Property("content", new ActivityString(activity.content), Level.optional);
      var generator = new Property("generator", new ActivityObject(activity.generator), Level.optional);
      var icon = new Property("icon", new MediaLink(activity.icon), Level.optional);
      var id = new Property("id", new ActivityString(activity.id), Level.recommended);
      var object = new Property("object", new ActivityObject(activity.object), Level.recommended);
      var published = new Property("published", new DateTime(activity.published), Level.required);
      var provider = new Property("provider", new ActivityObject(activity.provider), Level.optional);
      var target = new Property("target", new ActivityObject(activity.target), Level.optional);
      var title = new Property("title", new ActivityString(activity.title), Level.optional);
      var updated = new Property("updated", new DateTime(activity.updated), Level.optional);
      var url = new Property("url", new ActivityString(activity.url), Level.optional);
      var verb = new Property("verb", new ActivityString(activity.verb), Level.recommended);

      var getActor = function() {
        return actor;
      };

      var getContent = function() {
        return content;
      };

      var getGenerator = function() {
        return generator;
      };

      var getIcon = function() {
        return icon;
      };

      var getId = function() {
        return id.getValue() ? id : url;
      };

      var getObject = function() {
        if (activity.object) {
          return activity.object;
        } else {
          // imply object by context
        }
      };

      var getPublished = function() {
        return published;
      };

      var getProvider = function() {
        return provider;
      };

      var getTarget = function() {
        return target;
      };

      var getTitle = function() {
        return title;
      };

      var getUpdated = function() {
        return updated;
      };

      var getUrl = function() {
        return url;
      };

      var getVerb = function() {
        return verb.getValue() ? verb : "post";
      };

      var isValid = function() {
        return actor.isValid() &&
        content.isValid() &&
        generator.isValid() &&
        icon.isValid() &&
        id.isValid() &&
        object.isValid() &&
        published.isValid() &&
        provider.isValid() &&
        target.isValid() &&
        title.isValid() &&
        updated.isValid() &&
        url.isValid() &&
        verb.isValid();
      };

      return {
        isValid: isValid
      };
    };

    return Activity;

  });
  

define('types/collection',['types/int', 'types/array', 'types/string', 'types/property', 'types/property', 'types/object'], 
  function(ASInt, ASArray, ASString, Property, Level, ASObject) {

    var Collection = function(collection) {
      var totalItems = new Property("totalItems", new ASInt(collection.totalItems), Level.optional);
      var items = new Property("items", new ASArray(collection.items, ASObject), Level.recommended);
      var url = new Property("url", new ASString(collection.url), Level.recommended);

      var getTotalItems = function() {
        return totalItems;
      };

      var getItems = function() {
        return items;
      };

      var getUrl = function() {
        return url;
      };

      var isValid = function() {
        return totalItems.isValid() &&
        items.isValid() &&
        url.isValid() &&
        (url.hasValue() || items.hasValue());
      };

      return {
        getTotalItems: getTotalItems,
        getItems: getItems,
        getUrl: getUrl,
        isValid: isValid
      };
    };

    return Collection;

});

define('validate',['types/activity', 'types/collection'], function(ASActivity, ASCollection) {

  var Validator = function() {

    var validateActivity = function(activity) {
      var wrappedActivity = new ASActivity(activity);
      return wrappedActivity.isValid();
    };

    var validateCollection = function(collection) {
      var wrappedCollection = new ASCollection(collection);
      return wrappedCollection.isValid();
    };

    return {
      validateActivity: validateActivity,
      validateCollection: validateCollection
    };
  };

  return Validator;

});
