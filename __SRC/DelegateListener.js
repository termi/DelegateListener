// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name DelegateListener.js
// @check_types
// ==/ClosureCompiler==

;(function(global){

"use strict";
var Object_defineProperty = Object.defineProperty;

function _match(node, filter) {
	switch(typeof filter) {
		case "string"://CSS selector
			return node.matchesSelector(filter);

		case "object":
			var match = true;
			for(var i in filter)if(filter.hasOwnProperty(i)) {
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
	var elem = event.target,
		stopElement = event.currentTarget,
		result;
		
	if(Object_defineProperty) {//Cross-browser __event__ properties rebinding
		try { delete event.target; delete event.currentTarget } catch(_e_) {}
		Object_defineProperty(event, "currentTarget", {writable : true})
		Object_defineProperty(event, "target", {writable : true})
	}

	do {
		if(elem.nodeType !== 1 || !_match(elem, this._filter))continue;

		event.currentTarget = stopElement;
		event.target = elem;

		if(this.callback)result = this.callback.call(this.context || stopElement, event, this._filter);
	} while(result !== false && elem != stopElement && (elem = elem.parentNode));

	return result;
}

if (typeof module !== "undefined" && module["exports"]) {
	module["exports"] = DelegateListener
} else if (typeof global !== "undefined") {
	global["DelegateListener"] = DelegateListener
}

})(this);