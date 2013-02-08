function XhrProgress(elementId) {
	var el=elementId;
    var self = this;	

	this.createXhr = function() {
	  var xhr = newXhr();
	  if(xhr.hasOwnProperty('onprogress')) {
	    bindEvent(xhr, 'progress', function(evt) {
	      self.setProgress(50 + (evt.loaded / evt.total)*50);
	    });
	  } else {
	    var width=25;
	    var interval = window.setTimeout(function(){
	      if(document.getElementById(el) == null) {
	        window.clearInterval(interval);
	      } else {
	        width+=10;
	        self.setProgress(width);
	      }
	    }, 200);
	  }
	  return xhr;
	}

	this.setProgress = function(progressWidth) {
	  var element = document.getElementById(el);
	  if(element) {
	    element.style.width=progressWidth + '%';
	  } 
	}

	function newXhr() {
	  if (typeof ActiveXObject != 'undefined') {
	      try {
	        x = new ActiveXObject('Msxml2.XMLHTTP');
	        if (!x) {
	          x = new ActiveXObject('Microsoft.XMLHTTP');
	        }
	        return x;
	      } catch (e) {} // An exception will be thrown if ActiveX is disabled
	    }

	    // The second construct is for the benefit of jsunit...
	    if (typeof XMLHttpRequest != 'undefined' || window.XMLHttpRequest) {
	      return new window.XMLHttpRequest();
	    }
	}

	function bindEvent(obj, eventName, handler) {
	  if(obj.addEventListener) {
	    obj.addEventListener(eventName, handler, false);
	  } else if (obj.attachEvent) {
	    obj.attachEvent("on"+eventName, handler);
	  }
	}
}