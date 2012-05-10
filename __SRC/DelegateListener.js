// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name DelegateListener.js
// @check_types
// ==/ClosureCompiler==

/*
require:
1. FF < 9
if(!("parentElement" in Element.prototype))
	Object.defineProperty(Element.prototype, "parentElement", {"get" : function() {
		var parent = this.parentNode;

	    if(parent && parent.nodeType === 1)return parent;

	    return null;
	}});
2. matchesSelector: https://gist.github.com/2369850
*/

;(function(global){

"use strict";

var Object_defineProperty = Object.defineProperty,
	_hasOwnProperty = Object.prototype.hasOwnProperty;

function _match(node, filter) {
	switch(typeof filter) {
		case "string"://CSS selector
			return node.matchesSelector(filter);

		case "object":
			var match = true;
			for(var i in filter)if(_hasOwnProperty.call(filter, i)) {
				if(!(match = _objectMatch(i, filter[i], node)))break;
			}
			return match;
		break;

		case "function"://Custom filter
			return filter(node);
	}
}
function _objectMatch(key, value, node) {
	switch(typeof value) {
		case "undefined"://Attributes filter
			return node.hasAttribute(key);
		case "string":   //Attributes filter
			return node.getAttribute(key) === value;
		case "function": //Filter as callback
			if(_match(node, key))value.call(node, key);
			return true;
	}
}
function _unsafe_append(obj, extension) {
	for(var key in extension)
		if(!(key in obj))
			obj[key] = extension[key];
	
	return obj;
}

/**
 * @constructor
 */
function DelegateListener(filter, callback) {
	var thisObj = this;
	if(!(thisObj instanceof DelegateListener))return new DelegateListener(filter, callback);
	
	if(callback && callback.handleEvent) {
		thisObj.context = callback;
		callback = callback.handleEvent;
	}

	thisObj._filter = filter;
	thisObj.callback =callback;
}
DelegateListener.prototype.handleEvent = function(event) {
	if(Object_defineProperty) {//Cross-browser __event__ properties rebinding 1
		try { delete event.target; delete event.currentTarget } catch(_e_) {}
		Object_defineProperty(event, "currentTarget", {writable : true})
		Object_defineProperty(event, "target", {writable : true})
	}

	for(var elem = event.target,
			stopElement = event.currentTarget,
			result,
			fakeEvent
		; 
			result !== false && elem != stopElement
		;
			elem = elem.parentElement
		) {
		if(!_match(elem, this._filter))continue;

		try {
			event.currentTarget = stopElement;
			event.target = elem;
		}
		catch(e) {//Cross-browser __event__ properties rebinding 2
			//Old Opera and other legacy browsers
			fakeEvent = Object.create(event.constructor.prototype);
			_unsafe_append(fakeEvent, event);
			fakeEvent.currentTarget = stopElement;
			fakeEvent.target = elem;
			event = fakeEvent;
		}

		if(this.callback)result = this.callback.call(this.context || stopElement, event, this._filter);
	}

	return result;
}

if (typeof module !== "undefined" && module["exports"]) {
	module["exports"] = DelegateListener
} else if (typeof global !== "undefined") {
	global["DelegateListener"] = DelegateListener
}

})(this);