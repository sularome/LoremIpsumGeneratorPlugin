
	var Utils = function(){
        this.tagsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        }
		this.init();
        return this;
	}
	var Utils = window["Utils"] = Utils;
	
	Utils.prototype.init = function() {
		
		Array.prototype.clone = function() {
		  return this.slice(0);
		};
	}
	Utils.prototype.load = function(src, callback) {
		var script = document.createElement('script'),
			loaded;
		script.setAttribute('src', src);
		if (callback) {
		  script.onreadystatechange = script.onload = function() {
			if (!loaded) {
			  callback();
			}
			loaded = true;
		  };
		}
		document.getElementsByTagName('head')[0].appendChild(script);
	}
	
	Utils.prototype.findPos = function (obj) {
	  var curleft = curtop = 0;
	  if (obj.offsetParent) {
		do {
		  curleft += obj.offsetLeft;
		  curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	  }
	  return [curleft,curtop];
	}
	
	
	Utils.prototype.shuffle = function (o) {
	  for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
	  return o;
	}
	
	Utils.prototype.proxy = function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( typeof fn !== "function" ) {
			return undefined;
		}

		args = Array.prototype.slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( Array.prototype.slice.call( arguments ) ) );
		};

		return proxy;
	}
	Utils.prototype.proxy = function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( typeof fn !== "function" ) {
			return undefined;
		}

		args = Array.prototype.slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( Array.prototype.slice.call( arguments ) ) );
		};

		return proxy;
	} 
 
	Utils.prototype.safe_tags_replace = function(str) {
        var self = this;
        console.log(this);
        return str.replace(/[&<>]/g, function(tag) {
                    return self.tagsToReplace[tag] || tag;
                });
    }