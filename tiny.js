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
		var i, l, temp;

		// Select the correct nodes from the input
		// CASE: object passed
		if (typeof sel === 'object') {
			// CASE: Array of objects passed
			if ($.isArray(sel) || $.type(sel) === 'nodelist') {
				// Store the nodes into the tiny object
				for (i = 0, l = sel.length; i < l; i++) {
					this[i] = sel[i];
				}

				// There is no selector
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
			// Split by comma
			var sels = sel.split(/\s*,\s*/);

			// Create an array to store all the nodes to
			var nodes = [];

			// Loop through each selector and execute the query, saving the result
			for (i = 0, l = sels.length; i < l; i++) {
				temp = $.qs(sels[i]);
				for (var j = 0, k = temp.length; j < k; j++) {
					nodes.push(temp[j]);
				}
			}

			// console.log(nodes);

			// Store the nodes in the tiny object
			for (i = 0, l = nodes.length; i < l; i++) {
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
	 * Caching mechanism for generated templating functions
	 */
	var templateCache = {};

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
		 * Replaces the objects of this with whatever is returned
		 *
		 * @param {Function} fn
		 */
		_replace: function(fn) {
			var i, l;

			// Get the new objects
			var newObjects = fn.call(this);

			// Delete the old objects
			for (i = 0; i < this.length; i++) {
				delete this[i];
			}

			// Store the new length
			this.length = newObjects.length;

			// Store the new objects
			for (i = 0, l = this.length; i < l; i++) {
				this[i] = newObjects[i];
			}

			return this;
		},

		/**
		 * Finds the given selector using each object as a parent
		 *
		 * @param {String} sel
		 */
		find: function(sel) {
			// Update the selector
			if (this.sel) {
				this.sel += ' ' + sel;
			}

			return this._replace(function() {
				// Create an array to store the new nodes to
				var newObjects = [];

				// Make an array of all the selectors
				var sels = sel.split(/\s*,\s*/);

				// Loop through each object and treat it as a parent
				this.each(function() {
					// Query each selector
					for (var i = 0, l = sels.length; i < l; i++) {
						// Save the matches
						var temp = $.qs(sels[i], this);
						for (var j = 0, k = temp.length; j < k; j++) {
							newObjects.push(temp[j]);
						}
					}
				});

				return newObjects;
			});
		},

		/**
		 * Returns whether or not ALL the elements pass the given filter
		 *
		 * @param {String} test
		 */
		matches: function(test) {
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
		is: function(test) {
			return this._replace(function() {
				// Store all the nodes that pass the given filter
				var matches = [];
				for (var i = 0; i < this.length; i++) {
					if ($.is[test](this[i])) {
						matches.push(this[i]);
					}
				}

				return matches;
			});
		},

		/**
		 * Filters out elements that pass the given filter
		 *
		 * @param {String} test
		 */
		not: function(test) {
			return this._replace(function() {
				// Store all the nodes that pass the given filter
				var matches = [];
				for (var i = 0; i < this.length; i++) {
					if (!$.is[test](this[i])) {
						matches.push(this[i]);
					}
				}

				return matches;
			});
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
		 * @param {Mixed} template
		 * @param {Object} vals
		 *
		 * @credit http://ejohn.org/blog/javascript-micro-templating/
		 */
		template: function(template, data) {
			// Get the template string
			// HANDLE: tiny object
			if (template.tiny) {
				template = template.html();
			}
			// HANDLE: DOMObject
			if (typeof template === 'object') {
				template = template.innerHTML;
			}

			// Try to get the template from cache
			var fn = templateCache[template] || Function('obj',
				'var p=[],print=function(){p.push.apply(p,arguments);};' +

				// Introduce the data as local variables using with
				"with(obj || {}){p.push('" +

				// Convert the template to pure JavaScript
				template
					.replace(/[\r\t\n]/g, ' ')
					.split('<%').join('\t')
					.replace(/((^|%>)[^\t]*)'/g, '$1\r')
					.replace(/\t=(.*?)%>/g, "',$1,'")
					.split('\t').join("');")
					.split('%>').join("p.push('")
					.split('\r').join("\\'") +
				"');}return p.join('');" +

				// Add a source URL
				'\n//@ sourceURL=/tiny/template/source'
			);

			// Cache the function
			if (!templateCache[template]) {
				templateCache[template] = fn;
			}

			// Get the resulting HTML
			var result = fn(data);

			return this.each(function() {
				this.innerHTML = result;
			});
		},

		/**
		 * Replaces all of the elements with the next element
		 *
		 * @param {String} sel
		 */
		next: function(sel) {
			return this._replace(function() {
				// Make an array to store the matches in
				matches = [];

				// Loop through each of the elements and get the next sibling
				this.each(function() {
					var next = elementInRelation(this, 'nextSibling', sel);
					if (next) {
						matches.push(next);
					}
				});

				return matches;
			});
		},

		/**
		 * Replaces all of the elements with the previous element
		 *
		 * @param {String} sel
		 */
		prev: function(sel) {
			return this._replace(function() {
				// Make an array to store the matches in
				matches = [];

				// Loop through each of the elements and get the next sibling
				this.each(function() {
					var prev = elementInRelation(this, 'previousSibling', sel);
					if (prev) {
						matches.push(prev);
					}
				});

				return matches;
			});
		},

		/**
		 * Replaces all of the elements with their parent elements
		 *
		 * @param {String} sel
		 */
		parent: function(sel) {
			return this._replace(function() {
				// Make an array to store the matches in
				matches = [];

				// Loop through each of the elements and get the next sibling
				this.each(function() {
					var parent = elementInRelation(this, 'parentNode', sel);
					if (parent) {
						matches.push(parent);
					}
				});

				// Keep only the unique matches
				return $.unique(matches);
			});
		},

		/**
		 * Inserts an element before each of the nodes
		 *
		 * @param {String} tagName
		 * @param {Object} attrs
		 * @param {String} html
		 */
		before: function(tagName, attrs, html) {
			// Create the element
			var el = createElement(tagName, attrs, html);

			// Append before each of the elements
			return this.each(function() {
				this.parentNode.insertBefore(el, this);
			});
		},

		/**
		 * Inserts an element after each of the nodes
		 *
		 * @param {String} tagName
		 * @param {Object} attrs
		 * @param {String} html
		 */
		after: function(tagName, attrs, html) {
			// Create the element
			var el = createElement(tagName, attrs, html);

			// Append after each of the elements
			return this.each(function() {
				// Get the next sibling
				var nextSibling = elementInRelation(this, 'nextSibling');

				if (nextSibling) {
					// If the next sibling still exists, insert before it
					nextSibling.parentNode.insertBefore(el, nextSibling);
				}
				else {
					// Otherwise append the child to the parent and it will
					//   automatically go after
					this.parentNode.appendChild(el);
				}
			});
		},

		/**
		 * Appends an element to each element
		 *
		 * @param {String} tag		 
		 * @param {Object} attrs
		 * @param {String} html
		 */
		append: function(tagName, attrs, html) {
			// Create the element
			var el = createElement(tagName, attrs, html);

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
		 * @param {Object} attrs		 
		 * @param {String} html
		 */
		prepend: function(tagName, attrs, html) {
			// Create the element
			var el = createElement(tagName, attrs, html);

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
		},

		/**
		 * Reduces the set of elements to just the element at the index specified
		 *
		 * @param {Integer} index
		 */
		eq: function(index) {
			return this._replace(function() {
				return [this[index]];
			});
		},

		/**
		 * Creates a query string from a form
		 */
		serialize: function() {
			// Return false if there isn't a first element to work with or if the element is not a form
			if (!('0' in this) || this[0].nodeName !== 'FORM') {
				return false;
			}

			// Get the form
			var form = this[0];
			var queryString = '';
			var el;

			// Loop through all the inputs
			for (var i = 0; i < form.length; i++) {
				el = form[i];

				// Don't add if it's a submit/reset or if it's a checkbox/radio button that isn't checked
				if ($.inArray(el.type.toLowerCase(), ['submit', 'reset']) || ($.inArray(el.type.toLowerCase(), ['radio', 'checkbox']) && !el.checked)) {
					continue;
				}

				// Add to the query string
				queryString += '&' + (el.name ? el.name : el.id) + '=' + encodeURIComponent(el.value);
			}

			return queryString.substr(1);
		},

		/**
		 * Triggers a custom event
		 *
		 * @param {String} evt
		 * @param {Mixed} data
		 */
		trigger: function(evtName, data) {
			// HANDLE: Custom event
			// If the tiny object is empty assume it is a custom event
			if (!this[0] || isCustomEvent(this[0], evtName)) {
				return this.each(function() {
					customEvents[evtName].call(this, data);
				});
			}
			// HANDLE: Event that needs to be triggered
			else {
				// Create the event
				var evt;
				if (document.createEvent) {
					evt = document.createEvent('HTMLEvents');
					evt.initEvent(evtName, true, true);
				}
				else {
					evt = document.createEventObject();
					evt.eventType = evtName;
				}

				// Trigger the event on each of the elements
				return this.each(function() {
					if (document.createEvent) {
						this.dispatchEvent(evt);
					}
					else {
						this.fireEvent('on' + eventName, evt);
					}
				});
			}
		}
	};

	/**
	 * Throttles an event (for use with $.throttleEvents)
	 *
	 * @param {Function} fn
	 * @param {Integer} wait
	 *
	 * @return {Function}
	 */
	function throttle(fn, wait) {
		// Default wait to $.throttleWait
		wait = wait || $.throttleWait;

		var args;
		var result;
		var context;
		var timeoutId;
		var lastCalled = 0;

		function trailingCall() {
			lastCalled = new Date();
			timeoutId = undefined;
			fn.apply(context, args);
		}

		return function() {
			var now = new Date();
			var remain = wait - (now - lastCalled);

			args = arguments;
			context = this;

			if (remain <= 0) {
				lastCalled = now;
				result = fn.apply(context, args);
			}
			else if (!timeoutId) {
				timeoutId = setTimeout(trailingCall, remain);
			}

			return result;
		};
	}

	/**
	 * Events that should be throttled and the default wait to use
	 */
	$.throttleEvents = ['scroll'];
	$.throttleWait = 250;

	/**
	 * Checks whether the given event should be throttle
	 *
	 * @param {String} evt
	 *
	 * @return {Boolean}
	 */
	function shouldThrottle(evt) {
		return $.inArray(evt, $.throttleEvents);
	}

	/**
	 * Creates an element with the specified attributes
	 *
	 * @param {String} tagName
	 * @param {Object} attrs
	 * @param {String} html
	 *
	 * @return {DOMObject}
	 */
	function createElement(tagName, attrs, html) {
		var el = typeof tagName === 'string' ? document.createElement(tagName) : el;

		// Check if attrs is an iterable object
		if (typeof attrs === 'string') {
			// Attrs was not defined; flip attrs and html
			html = attrs;
		}
		else {
			// Attrs was defined; set all the attributes
			for (var attr in attrs) {
				el.setAttribute(attr, attrs[attr]);
			}
		}

		// Set the html if it was passed
		if (html) {
			el.innerHTML = html;
		}

		return el;
	}

	/**
	 * Finds the first element in relation to the current element with
	 * the given selector (if passed)
	 *
	 * @param {DOMObject} el
	 * @param {String} relation
	 * @param {String} sel
	 */
	function elementInRelation(el, relation, sel) {
		el = el[relation];
		
		// Check to see if there was a selector passed
		if (sel) {
			// Add an additional case that the element must be a match
			while(el && (el.nodeType !== 1 || !$.testSel(el, sel))) {
				el = el[relation];
			}
		}
		else {
			// Keep getting the previous element while there is one and while it is not a DOMObject
			while(el && el.nodeType !== 1) {
				el = el[relation];
			}
		}
		
		// Save the element that was found, if there was one and it is a match
		if (el) {
			if (sel && $.testSel(el, sel)) {
				return el;
			}
			else {
				return el;
			}
		}

		return false;
	}

	/**
	 * Event binding and unbinding
	 *
	 * For binding:
	 *  @param {DOMObject} el
	 *  @param {String} evt
	 *  @param {Function} fn
	 *  @param {String} namespace
	 *
	 * For unbinding:
	 *  @param {DOMObject} el
	 *  @param {String} evt
	 *  @param {String} namespace
	 */
	var bind;
	var unbind;
	if (typeof addEventListener !== 'undefined') {
		bind = function(el, evt, fn, namespace) {
			// Bind the function to the event
			el.addEventListener(evt, fn, false);

			// Store the function to the element so it can be unbound later.
			//   Use the namespace if available
			var hash = 'tiny_' + evt + (namespace ? '_' + namespace : '');

			// Create an array to hold the functions if there is not one already
			if (!el[hash]) {
				el[hash] = [];
			}

			// Push the function to the storage on the element
			el[hash].push(fn);
		};

		unbind = function(el, evt, namespace) {
			var hash = 'tiny_' + evt + (namespace ? '_' + namespace : '');

			// Remove the event listener of each of the stored functions			
			for (var i = 0, l = el[hash].length; i < l; i++) {
				el.removeEventListener(evt, el[hash][i], false);
			}

			// Delete the functions from the storage on the element
			delete el[hash];
		};
	}
	else if (typeof attachEvent !== 'undefined') {
		bind = function(el, evt, fn, namespace) {
			// Create a function that will call the user function inside of it
			var onEvent = function() {
				var type = event.type;
				var relatedTarget = null;

				// If the type is mouseover or mouseout, set the realtedTarget
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

			// Store the function to the element so it can be unbound later.
			//   Use the namespace if available
			el['tiny_' + evt + '_' + (namespace ? namespace : '')] = fn;

			// Bind the event to the element
			el.attachEvent('on' + evt, onEvent);
		};

		unbind = function(el, evt, namespace) {
			el.detachEvent('on' + evt, el['tiny_' + evt + '_' + (namespace ? namespace : '')]);
			delete el['tiny_' + evt + '_' + (namespace ? namespace : '')];
		};
	}

	/**
	 * Keyboard shortcut helper
	 *
	 * @param {DOMObject} el
	 * @param {String} keyCombination
	 * @param {String} fn
	 * @param {DOMObject} context
	 */
	function keyboardShortcut(el, keyCombination, fn, context) {
		// Map some key bindings to the longhand version
		var helpers = {
			'?': 'shift+/',
			'!': 'shift+1',
			'\\+': 'shift+='
		};

		for (var helper in helpers) {
			keyCombination = keyCombination.replace(helper, helpers[helper]);
		}

		// Figure out which keys need to be pressed (ctrl, alt, shift)
		var keys = keyCombination.toLowerCase().split('+');
		var key = null;
		var ctrl = false;
		var alt = false;
		var shift = false;

		for (var i = 0, l = keys.length; i < l; i++) {
			if (keys[i] === 'ctrl') {
				ctrl = true;
			}
			else if (keys[i] === 'shift') {
				shift = true;
			}
			else if (keys[i] === 'alt') {
				alt = true;
			}
			else {
				key = keys[i].toUpperCase().charCodeAt(0);
			}
		}

		// Bind the event
		bind(el, 'keyup', function(e) {
			var isShortcut = true;
			if (ctrl && !e.ctrlKey || shift && !e.shiftKey ||
					alt && !e.altKey || key && e.which !== key) {
				isShortcut = false;
			}

			if (isShortcut) {
				e.preventDefault();
				e.stopPropagation();
				fn.call(context || el, e);
			}
		});
	}

	/**
	 * Decides whether the given event is a shortcut
	 *
	 * @param {String} evt
	 *
	 * @return {Boolean}
	 */
	function isShortcut(evt) {
		return evt.length === 1 || evt.indexOf('+') !== -1;
	}

	/**
	 * All the custom events
	 */
	var customEvents = {};

	/**
	 * Returns whether there is a custom event with the given name
	 *
	 * @param {String} evt
	 *
	 * @return {Boolean}
	 */
	function isCustomEvent(el, evt) {
		return !('on' + evt in el);
	}

	/**
	 * Event listening and delegating
	 *
	 * @param {String} evt
	 * @param {String} children
	 * @param {Function} fn
	 * @param {String} namespace
	 *
	 * @param {String} evt
	 * @param {String} children
	 * @param {Function} fn
	 * @param {String} namespace
	 */
	$.fn.on = function(evts, children, fn, shortcut) {
		// Decide whether the event should be delegated or bound directly
		var shouldDelegate = typeof fn === 'function';

		// If the event should be bound directly the variables need to be moved around
		if (!shouldDelegate) {
			shortcut = fn;
			fn = children;
		}

		// Check for a shortcut and bind the function to that as well
		if (shortcut) {
			keyboardShortcut(window, shortcut, fn, this[0] ? this[0] : window);
		}

		// Turn evt into an array if it is not one
		evts = $.isArray(evts) ? evts : [evts];

		for (var i = 0, l = evts.length; i < l; i++) {
			// Get the event and namespace
			var eventParts = evts[i].split('.');
			var namespace = eventParts[1];
			var evt = eventParts[0];
			var shouldThrottleEvent = shouldThrottle(evt);

			// Check the input format
			// CASE: string, function[, string]
			if (!shouldDelegate) {
				this.each(function() {
					if (isShortcut(evt)) {
						keyboardShortcut(this, evt, fn);
					}
					else if (isCustomEvent(this, evt)) {
						customEvents[evt] = fn;
					}
					else {
						bind(this, evt, shouldThrottleEvent ? throttle(fn) : fn, namespace);
					}
				});
			}
			// CASE: string, string, function[, string]
			else {
				// Delegate event
				this.each(function() {
					// Save the current working element
					var el = this;

					// Make a function that will bubble up then conditionally
					//   call the callback
					var bubbleFunc = function(e) {
						// Get the event target
						var target = e.target;

						// Bubble up while the target is not a match and you haven't reached the top
						while (target !== el && !$.testSel(target, children)) {
							// Move up a level in the DOM
							target = target.parentNode;
						}

						// Execute the function if you didn't reach the element
						if (target !== el) {
							fn.call(target, e);
						}
					};

					// Bind to the event
					bind(el, evt, shouldThrottleEvent ? throttle(bubbleFunc) : bubbleFunc, namespace);
				});
			}
		}

		return this;
	};

	/**
	 * Unbinding events
	 *
	 * @param {String} evt
	 * @param {String} namespace
	 */
	$.fn.off = function(evt) {
		// Split the event by a period to get the event and the namespace
		var eventParts = evt.split('.');
		var namespace = eventParts[1];
		evt = eventParts[0];

		// Unbind each element
		return this.each(function() {
			unbind(this, evt, namespace);
		});
	};

	/**
	 * Creating keyboard shortcuts
	 *
	 * @param keyCombination
	 * @param {Function} fn
	 */
	$.shortcut = function(keyCombination, fn) {
		keyboardShortcut(window, keyCombination, fn);
	};

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
		// CASE: Tiny object
		if (o.data.tiny) {
			// Serialize the form
			data = o.data.serialize();
		}
		// CASE: JSON object
		else if (typeof o.data === 'object') {
			// Create the string from the data object
			for (var key in o.data) {
				data += '&' + key + '=' + encodeURIComponent(o.data[key]);
			}
			// Chop off the leading ampersand
			data = data.substr(1);
		}
		// CASE: string
		else {
			data = o.data;
		}

		// Allow simulation of PUT and DELETE requests
		if (type === 'PUT' || type === 'DELETE') {
			// Add _method to data
			data += data.length === 0 ? '' : '&';
			data += '_method=' + type;

			// Make it a post request
			type = 'POST';
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
	 * Returns an array with only unique values
	 *
	 * @param {Object} obj
	 *
	 * @return {Object} unique
	 */
	$.unique = function(obj) {
		// Define the unique array
		var unique = [];

		// Go through every element in the object
		for (var i = 0; i < obj.length; i++) {
			// Check against the unique array if it should be added
			var shouldAdd = true;
			for (var j = 0; j < unique.length; j++) {
				// Object is not unique; break
				if (obj[i] === unique[j]) {
					shouldAdd = false;
					break;
				}
			}

			// Add the element to the unique array if it is unique
			if (shouldAdd) {
				unique.push(obj[i]);
			}
		}

		// Return the unique array
		return unique;
	};

	/**
	 * Filters, using $().matches(), $().is(), or $().not()
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
	 * Returns whether the given key is the given array
	 *
	 * @param {Object} key
	 * @param {Array} arr
	 *
	 * @return {Boolean} inArray
	 */
	$.inArray = function(key, arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === key) {
				return true;
			}
		}
		return false;
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
}(window.document, window));