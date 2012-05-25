(function(document, window, undefined) {
	/**
	 * Wrapper for creating new tiny object
	 *
	 * @param {String} sel
	 *
	 * @return {Object} $.init
	 */
	var $ = function(sel) {
		// Initialize a new tiny object
		return new $.init(sel);
	};

	/**
	 * Set up a new tiny object to work with
	 *
	 * @param {String} sel
	 */
	$.init = function(sel) {
		// Select the correct nodes from the input
		// CASE: object passed
		if (typeof sel === 'object') {
			// CASE: Array of objects passed
			if ($.isArray(sel) || $.type(sel) === 'nodelist') {
				// Store the nodes into the tiny object
				for (var i = 0; i < sel.length; i++) {
					this[i] = sel[i];
				}

				// There is no sel
				this.sel = '';

				// Store the number of nodes
				this.length = sel.length;
			}
			// CASE: Just one object passed
			else {
				this[0] = sel;
				this.length = 1;
				this.sel = '';
			}
		}
		// CASE: selector passed
		else if (typeof sel === 'string') {
			// Query the nodes from the DOM
			var nodes = $.qs(sel);

			// Store the nodes in the tiny object
			for (var i = 0; i < nodes.length; i++) {
				this[i] = nodes[i];
			}

			// Store the length and the sel
			this.sel = sel;
			this.length = nodes.length;
		}

		// Set an attribute of tiny for use in determining whether or not an object is a tiny object
		this.tiny = true;
	};

	/**
	 * Methods that work with the nodes
	 */
	$.fn = $.init.prototype = {
		/**
		 * Return whether ALL the elements have a certain class
		 *
		 * @param {String} cls
		 *
		 * @return {Boolean} hasClass
		 */
		hasClass: function(cls) {
			// Assume all the nodes have the class until you find one that doesn't
			var hasClass = true;
			var regex = RegExp('(\\s|^)' + cls + '(\\s|$)');
			
			// Check each element's class against the regular expression
			this.each(function() {
				if (!regex.exec(this.className)) {
					hasClass = false;
				}
			});

			// Return what you found
			return hasClass;
		},

		/**
		 * Adds a class to each element if it does not already have it
		 *
		 * @param {String} cls
		 */
		addClass: function(cls) {
			var regex = RegExp('(\\s|^)' + cls + '(\\s|$)');

			// Loop through each of the elements
			return this.each(function() {
				// Check to see if the element already has the given class
				if (!regex.exec(this.className)) {
					// The element does not have the class; add it
					this.className += ' ' + cls;
				}
			});
		},

		/**
		 * Removes a class from each element
		 *
		 * @param {String} cls
		 */
		removeClass: function(cls) {
			var regex = RegExp('(\\s|^)' + cls + '(\\s|$)');

			// Loop through each of the elements
			return this.each(function() {
				// Replace any occurences of the class with a space
				this.className = this.className.replace(regex, ' ');
			});
		},

		/**
		 * Updates the CSS of each element
		 *
		 * @param {String} attribute
		 * @param {String} value
		 *
		 * @param {Object} props
		 */
		css: function(attr, value) {
			// Check the input format
			// CASE: string, string
			if (typeof attr === 'string' && typeof value === 'string') {
				// Set the style attribute's value to value
				return this.each(function() {
					this.style[$.toCamelCase(attr)] = value;
				});
			}
			// CASE: object
			else {
				// Loop through each of the objects
				return this.each(function() {
					// Loop through each of the key/value pairs and set the styles
					for (var key in attr) {
						this.style[$.toCamelCase(key)] = attr[key];
					}
				});
			}
		},

		/**
		 * Hides all the elements
		 */
		hide: function() {
			return this.each(function() {
				this.style.display = 'none';
			});
		},

		/**
		 * Shows all the elements
		 */
		show: function() {
			return this.each(function() {
				this.style.display = 'block';
			});
		},

		/**
		 * Toggles the display of the elements
		 */
		toggle: function() {
			return this.each(function() {
				this.style.display = this.style.display === 'block' ? 'none' : 'block';
			});
		},

		/**
		 * Updates the attribute(s) of each element
		 *
		 * @param {String} attr
		 * @param {String} value
		 *
		 * @param {Object} attrs
		 */
		attr: function(attr, value) {
			// Check the input format
			// CASE: string, string
			if (typeof attr === 'string' && typeof value === 'string') {
				// Set the attribute to the value on each element
				return this.each(function() {
					this.setAttribute(attr, value);
				});
			}
			// CASE: string
			else if (typeof attr === 'string' && typeof value === 'undefined') {
				// Return the value of the attribute of the first element, or false if there are no elements
				return this.length > 0 ? this[0].getAttribute(attr) : false;
			}
			// CASE: object
			else {
				// Loop through each element
				return this.each(function() {
					// Loop through each key/value pair and set the attributes
					for (var key in attr) {
						this.setAttribute(key, attr[key]);
					}
				});
			}
		},


		/**
		 * Executes code on each element
		 *
		 * @param {Function} fn
		 */
		each: function(fn) {
			// Execute the function on each of nodes
			for (var i = 0; i < this.length; i++) {
				fn.call(this[i], i, this);
			}

			return this;
		},

		/**
		 * Returns whether or not ALL the elements pass the given filter
		 *
		 * @param {String} test
		 */
		is: function(test) {
			// Assume all elements pass the test until one is found that does not
			var passes = true;

			// Loop through each element and check if it passes the test
			this.each(function() {
				if (!$.is[test](this)) {
					passes = false;
				}
			});

			// Return the result
			return passes;
		},

		/**
		 * Filters out elements that do not pass the given filter
		 *
		 * @param {String} test
		 */
		filter: function(test) {
			// Store all the nodes that pass the given filter
			var matches = [];
			for (var i = 0; i < this.length; i++) {
				if ($.is[test](this[i])) {
					matches.push(this[i]);
				}
			}

			// Remove the old values from the array
			for (i = 0; i < this.length; i++) {
				delete this[i];
			}

			// Store the new length
			this.length = matches.length;

			// Store the new elements
			for (i = 0; i < this.length; i++) {
				this[i] = matches[i];
			}

			return this;
		},

		/**
		 * Setting and retrieving the HTML of the elements
		 *
		 * @param {String} html
		 */
		html: function(html) {
			// Check the input format
			// CASE: string
			if (typeof html === 'string') {
				// Set the HTML of each of the elements
				return this.each(function() {
					this.innerHTML = html;
				});
			}
			// CASE: undefined
			else {
				// Return the HTML of the first element, or false if there are no elements
				return this.length > 0 ? this[0].innerHTML : false;
			}
		},

		/**
		 * Setting and retrieving the value of the elements
		 *
		 * @param {String} html
		 */
		val: function(val) {
			// Check the input format
			// CASE: string
			if (typeof val === 'string') {
				// Set the HTML of each of the elements
				return this.each(function() {
					this.value = val;
				});
			}
			// CASE: undefined
			else {
				// Return the HTML of the first element, or false if there are no elements
				return this.length > 0 ? this[0].value : false;
			}
		},

		/**
		 * Really simple templating system
		 *
		 * @param {String} template
		 * @param {Object} vals
		 *
		 * @param {Object} template
		 * @param {Object} vals
		 */
		template: function(template, vals) {
			// Check the template format
			// CASE: object
			if (typeof template === 'object') {
				// CASE: tiny object
				if ('tiny' in template) {
					template = template.html();
				}
				// CASE: DOMObject
				else {
					template = template.innerHTML;					
				}
			}

			// Set the HTML of each of the elements to the templated value
			return this.each(function() {
				var html = template;
				for (var key in vals) {
					html = html.replace(RegExp('\\${' + key + '}', 'g'), vals[key]);
				}
				this.innerHTML = html;
			});
		},

		/**
		 * Replaces all of the elements with the next element
		 *
		 * @param {String} sel
		 */
		next: function(sel) {
			// Make an array to store the matches in
			matches = [];

			// Loop through each of the elements and get the next sibling
			this.each(function() {
				var el = this.nextSibling;
				
				// Check to see if there was a selector passed
				if (sel) {
					// Add an additional case that the element must be a match
					while(el && (el.nodeType !== 1 || !$.testSel(el, sel))) {
						el = el.nextSibling;
					}
				}
				else {
					// Keep getting the next element while there is one and while it is not a DOMObject
					while(el && el.nodeType !== 1) {
						el = el.nextSibling;
					}
				}
				
				// Save the element that was found, if there was one and it is a match
				if (el) {
					if (sel && $.testSel(el, sel)) {
						matches.push(el);
					}
					else {
						matches.push(el);
					}
				}
			});

			// Remove the old elements
			for (var i = 0; i < this.length; i++) {
				delete this[i];
			}

			// Store the data that was found
			this.length = matches.length;
			for (i = 0; i < this.length; i++) {
				this[i] = matches[i];
			}

			return this;
		},

		/**
		 * Replaces all of the elements with the previous element
		 *
		 * @param {String} sel
		 */
		prev: function(sel) {
			// Make an array to store the matches in
			matches = [];

			// Loop through each of the elements and get the next sibling
			this.each(function() {
				var el = this.previousSibling;
				
				// Check to see if there was a selector passed
				if (sel) {
					// Add an additional case that the element must be a match
					while(el && (el.nodeType !== 1 || !$.testSel(el, sel))) {
						el = el.previousSibling;
					}
				}
				else {
					// Keep getting the previous element while there is one and while it is not a DOMObject
					while(el && el.nodeType !== 1) {
						el = el.previousSibling;
					}
				}
				
				// Save the element that was found, if there was one and it is a match
				if (el) {
					if (sel && $.testSel(el, sel)) {
						matches.push(el);
					}
					else {
						matches.push(el);
					}
				}
			});

			// Remove the old elements
			for (var i = 0; i < this.length; i++) {
				delete this[i];
			}

			// Store the data that was found
			this.length = matches.length;
			for (i = 0; i < this.length; i++) {
				this[i] = matches[i];
			}

			return this;
		},

		/**
		 * Replaces all of the elements with their parent elements
		 *
		 * @param {String} sel
		 */
		parent: function(sel) {
			// Make an array to store the matches in
			matches = [];

			// Loop through each of the elements and get the next sibling
			this.each(function() {
				var el = this.parentNode;
				
				// Check to see if there was a selector passed
				if (sel) {
					// Add an additional case that the element must be a match
					while(el && (el.nodeType !== 1 || !$.testSel(el, sel))) {
						el = el.parentNode;
					}
				}
				else {
					// Keep getting the previous element while there is one and while it is not a DOMObject
					while(el && el.nodeType !== 1) {
						el = el.parentNode;
					}
				}
				
				// Save the element that was found, if there was one and it is a match
				if (el) {
					if (sel && $.testSel(el, sel)) {
						matches.push(el);
					}
					else {
						matches.push(el);
					}
				}
			});

			// Remove the old elements
			for (var i = 0; i < this.length; i++) {
				delete this[i];
			}

			// Store the data that was found
			this.length = matches.length;
			for (i = 0; i < this.length; i++) {
				this[i] = matches[i];
			}

			return this;
		},

		/**
		 * Appends an element to each element
		 *
		 * @param {String} tag		 
		 * @param {String} html
		 * @param {Object} attrs
		 */
		append: function(tag, html, attrs) {
			// Set defaults for the attributes and innerHTML
			attrs = attrs || {};
			html = html || '';

			var el;

			// Check the input format
			// CASE: object
			if (typeof tag === 'object') {
				// DOMObject was passed, use this
				el = tag;
			}
			else {
				// Parameters were passed, construct an element
				// Create the element, add the attributes, and edit the innerHTML
				el = document.createElement(tag);
				for (var key in attrs) {
					el.setAttribute(key, attrs[key]);
				}
				el.innerHTML = html;
			}

			// Loop through each element
			return this.each(function() {
				// Append the element
				this.appendChild(el);
			});
		},

		/**
		 * Prepends an element to each element
		 *
		 * @param {String} tag
		 * @param {String} html
		 * @param {Object} attrs		 
		 */
		prepend: function(tag, html, attrs) {
			// Set defaults for the attributes and innerHTML
			attrs = attrs || {};
			html = html || '';

			var el;

			// Check the input format
			// CASE: object
			if (typeof tag === 'object') {
				// DOMObject was passed, use this
				el = tag;
			}
			else {
				// Parameters were passed, construct an element
				// Create the element, add the attributes, and edit the innerHTML
				el = document.createElement(tag);
				for (var key in attrs) {
					el.setAttribute(key, attrs[key]);
				}
				el.innerHTML = html;
			}

			// Loop through each element
			return this.each(function() {
				// Check if there's a first child to insert before
				if (this.firstChild) {
					// Prepend the new element
					this.insertBefore(el, this.firstChild);
				}
				else {
					// The element is empty; just append it
					this.appendChild(el);
				}
			});
		}
	};

	/**
	 * Event binding
	 *
	 * @param {String} evt
	 * @param {Function} fn
	 *
	 * @param {String} evt
	 * @param {String} children
	 * @param {Function} fn
	 */
	if (typeof addEventListener !== 'undefined') {
		// Use new standards model
		$.fn.on = function(evt, children, fn) {
			var eventHash = 'tiny_' + evt;

			// Check the input format
			// CASE: string, function
			if (typeof children === 'function') {
				// Just bind the function to the evt
				fn = children;

				return this.each(function() {
					// Bind to the evt
					this.addEventListener(evt, fn, false);

					// Store a copy of the function on the element
					this[eventHash] = fn;
				});
			}
			// CASE: string, string, function
			else {
				// Delegate evt
				return this.each(function() {
					// Save the current working element
					var el = this;

					// Bind to the evt
					el.addEventListener(evt, function(e) {
						// Get the evt target
						var target = e.target;

						// Bubble up while the target is not a match and you haven't reached the element
						while (target !== el && !$.testSel(target, children)) {
							// Move up a level on the DOM
							target = target.parentNode;
						}

						// Execute the function if you didn't reach the element
						if (target !== el) {
							fn.call(target, e);
						}
					}, false);

					// Store a copy of the function on the element
					el[eventHash] = fn;
				});
			}
		};

		$.fn.off = function(evt) {
			return this.each(function() {
				this.removeEventListener(evt, this['tiny_' + evt], false);
			});
		};
	}
	else if (typeof attachEvent !== 'undefined') {
		// Use old IE evt model
		$.fn.on = function(evt, sel, fn) {
			var eventHash = 'tiny_' + evt;

			// Check the input format
			// CASE: string, function
			if (typeof sel === 'function') {
				// Just bind the function to the event
				fn = sel;

				return this.each(function() {
					// Save a copy of the current working element
					var el = this;

					// Store the function in the element so it can be removed later
					el[eventHash] = function() {
						// Get the type and the related target
						var type = event.type;
						var relatedTarget = null;

						// If the event is a mouseover or mouseout, set the relatedTarget
						if (type === 'mouseover' || type === 'mouseout') {
							relatedTarget = type === 'mouseover' ? event.fromElement : event.toElement;
						}

						// Call the function in the proper context
						fn.call(el, {
							target: event.srcElement,
							type: type,
							relatedTarget: relatedTarget,
							_event: event,
							preventDefault: function() {
								this._event.returnValue = false;
							},
							stopPropagation: function() {
								this._event.cancelBubble = true;
							}
						});
					};

					// Attach the event to the function
					el.attachEvent('on' + evt, this[eventHash]);
				});
			}
			// CASE: string, string, function
			else {
				// Do event delegation
				return this.each(function() {
					// Save the current working element
					var el = this;

					// Store the function in the element so it can be removed later
					el[eventHash] = function() {
						// Get the type and the related target
						var type = event.type;
						var relatedTarget = null;

						// If the event is a mouseover or mouseout, set the relatedTarget
						if (type === 'mouseover' || type === 'mouseout') {
							relatedTarget = type === 'mouseover' ? event.fromElement : event.toElement;
						}

						// Get the element that the event was invoked on
						var target = event.srcElement;

						// Keep moving up the DOM tree until you match the selector or you reach the element
						while (target !== el && !$.testSel(target, sel)) {
							target = target.parentNode;
						}

						// Call the function as long as you didn't reach the element
						if (target !== el) {
							fn.call(target, {
								target: event.srcElement,
								type: type,
								relatedTarget: relatedTarget,
								_event: event,
								preventDefault: function() {
									this._event.returnValue = false;
								},
								stopPropagation: function() {
									this._event.cancelBubble = true;
								}
							});
						}
					};

					// Attach the event to the function
					el.attachEvent('on' + evt, this[eventHash]);
				});
			}
		};

		$.fn.off = function(evt) {
			return this.each(function() {
				this.detachEvent('on' + evt, this['tiny_' + evt]);
				delete this['tiny_' + evt];
			});
		};
	}

	/**
	 * AJAX
	 *
	 * @param {Object} o
	 *
	 * @credit quirksmode http://www.quirksmode.org/js/xmlhttp.html
	 */
	$.ajax = function(o) {
		// Get the values that were passed (setting defaults)
		var type    = o.type ? o.type.toUpperCase() : 'GET';
		var success = o.success || function(){};
		var error   = o.error || function(){};
		var data    = '';
		var async   = o.async != null ? o.async : true;

		// Construct the data object
		// CASE: object
		if (typeof o.data === 'object') {
			// Create the string from the data object
			for (var key in o.data) {
				data += '&key=' + o.data[key];
			}
			// Chop off the leading ampersand
			data = data.substr(1);
		}
		// CASE: string
		else {
			data = o.data;
		}

		// Create the xhr object
		var xhr = false;

		// All the possible factories that could be used for AJAX requests
		var factories = [
			function() { return new XMLHttpRequest(); },
			function() { return new ActiveXObject('Msxml2.XMLHTTP'); },
			function() { return new ActiveXObject('Msxml3.XMLHTTP'); },
			function() { return new ActiveXObject('Microsoft.XMLHTTP'); }
		];

		// Find the one that the browser supports
		for (var i = 0; i < factories.length; i++) {
			try {
				xhr = factories[i]();
			}
			catch (e) {
				continue;
			}
			break;
		}

		// If an xhr object could not be created, error out
		if (!xhr) {
			error.call('418');
			return;
		}

		// Open the request
		xhr.open(type, type === 'GET' ? o.url + '?' + data : o.url, async);

		// Set the proper request headers
		if (type !== 'GET') {
			xhr.setRequestHeader('Content-type', 'application/x-www-form-encoded');
		}

		// Listen to the readystatechange event
		xhr.onreadystatechange = function() {
			// Quit if the request isn't finished
			if (xhr.readyState !== 4) {
				return;
			}

			// Check the request status
			if (xhr.status === 200 || xhr.status === 304) {
				// Request was successful, trigger the success callback
				success.call(window, xhr.responseText, xhr.status);
			}
			else {
				// There was an error somewhere, trigger the error callback
				error.call(window, xhr.status);
			}
		};

		// Initiate the request
		xhr.send(type === 'GET' ? null : data);
	};

	/**
	 * Returns an array of items queried from the DOM
	 *
	 * @param {String} sel
	 * @param {Object} parent
	 *
	 * @return {Array} nodes
	 */
	// Check for the existence of a native document.querySelectorAll
	if (document.querySelectorAll) {
		// Browser provides native DOM querying, use that
		$.qs = function(sel, parent) {
			return (parent || document).querySelectorAll(sel);
		};
	}
	else {
		$.qs = function(sel, parent) {
			// document.querySelectorAll must by polyfilled

			// Split the sel into individual sels
			var sels = sel.split(' ');

			// Start with the leftmost sel and work to the right to find the matched nodes
			var parents = parent ? [parent] : [document];
			for (var i = 0; i < sels.length; i++) {
				// Make an array to store the newly found elements in
				var finds = [];

				// Loop through each of the parents and add the matches to the array
				for (var j = 0; j < parents.length; j++) {
					var children;
					// Check the sel format
					// CASE: id
					if (sels[i].charAt(0) === '#') {
						children = [document.getElementById(sels[i].substr(1))];
					}
					// CASE: class
					else if (sels[i].charAt(0) === '.') {
						children = cls(sels[i].substr(1), parents[j]);
					}
					// CASE: tag
					else {
						children = parents[j].getElementsByTagName(sels[i]);
					}

					// Add all the children to the finds
					for (var k = 0; k < children.length; k++) {
						finds.push(children[k]);
					}
				}

				// Store the finds as the new parents
				parents = finds;
			}

			// Return what was found
			return parents;
		};
	}

	/**
	 * Returns the elements of the parent (or the document) that have a given class
	 *
	 * @param {String} cls
	 * @param {Object} parent
	 */
	var cls;
	// Check for the existence of a native document.getElementsByClassName method
	if (document.getElementsByClassName) {
		// There is a native document.getElementsByClassName method; use this
		cls = function(cls, parent) {
			return (parent || document).getElementsByClassName(cls);
		};
	}
	else {
		// A get by class method must be polyfilled
		cls = function(cls, parent) {
			// Default the parent element to the document
			parent = parent || document;

			// Get all the children of the parent
			var els = parent.getElementsByTagName('*');

			// Make an array to store to and a regular expression for testing the class names
			var finds = [];
			var regex = RegExp('(\\s|^)' + cls + '(\\s|$)');

			// Loop through all of the children			
			for (var i = 0; i < els.length; i++) {
				// Check the element's class against the given class
				if (regex.exec(els[i].className)) {
					// Element does have the class; add it
					finds.push(els[i]);
				}
			}

			// Return what was found
			return finds;
		};
	}

	/**
	 * Filters, using $().is() or $().filter()
	 */
	$.is = {
		'visible': function(el) {
			return el.offsetHeight !== 0 && el.offsetWidth !== 0;
		},

		'hidden': function(el) {
			return el.offsetHeight === 0 && el.offsetWidth === 0;
		},

		'empty': function(el) {
			return el.childNodes.length === 0;
		}
	};

	/**
	 * Returns the type of an object; more specific than typeof
	 * See http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
	 *
	 * @param {Object} object
	 *
	 * @return {String} type
	 */
	$.type = function(obj) {
		return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	};

	/**
	 * Returns whether or not the passed object is an array
	 *
	 * @param {Object} obj
	 *
	 * @return {Boolean} isArray
	 */
	$.isArray = function(obj) {
		return $.type(obj) === 'array';
	};

	/**
	 * Returns the camelCase equivalent of-a-string
	 *
	 * @param {String} str
	 *
	 * @return {String} camelCasedStr
	 */
	$.toCamelCase = function(str) {
		return str.replace(/\-([a-z])/g, function (match, p1) {
			return p1.toUpperCase();
		});
	};

	/**
	 * Tests an object against a selector
	 *
	 * @param {Object} el
	 * @param {String} sel
	 *
	 * @return {Boolean} matches
	 */
	$.testSel = function(el, sel) {
		// CASE: sel is an id
		if (sel.charAt(0) === '#') {
			return el.id === sel.substr(1);
		}
		// CASE: sel is a class
		else if (sel.charAt(0) === '.') {
			return $(el).hasClass(sel.substr(1));
		}
		// CASE: sel is a tag
		else {
			return el.nodeName === sel.toUpperCase();
		}
	};

	// Expose $ to global scope
	window.$ = $;
}(document, window));