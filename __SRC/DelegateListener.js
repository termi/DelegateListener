// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name DelegateListener.js
// @check_types
// ==/ClosureCompiler==

;(function(global){

"use strict";

/**
 * @constructor
 */
function DelegateListener(filter, callback) {
	var thisObj = this;
	if(!(thisObj instanceof DelegateListener))return new DelegateListener(filter, callback);
	
	if(callback.handleEvent) {
		thisObj.context = callback;
		callback = callback.handleEvent;
	}

	thisObj.filter = filter;
	thisObj.callback =callback;
}
DelegateListener.prototype.handleEvent = function(event) {
	var elem = event.target,
		stopElement = event.currentTarget,
		result;

	do {
		if(elem.nodeType !== 1 || !this.match(elem, this.filter))continue;

		event.currentTarget = stopElement;
		if(event.currentTarget !== stopElement) {
			delete event.currentTarget;//IE < 9 throw exception here
			event.currentTarget = stopElement;
		}
			
		event.target = elem;
		if(event.currentTarget !== stopElement) {
			delete event.target;
			event.target = elem;
		}
		

		result = this.callback.call(this.context || stopElement, event);
	} while(result !== false && elem != stopElement && (elem = elem.parentNode));

	return result;
}
DelegateListener.prototype.match = function(node, filter) {
	if(typeof filter == "string") {//CSS selector
		return node.matchesSelector(filter)
	}
	if(typeof filter == "object") {//Attributes filter
		return Object.keys(filter).every(function(key) {
			return filter[key] !== void 0 ?
				node.getAttribute(key) === filter[key] :
				node.hasAttribute(key);
		})
	}
	if(typeof filter == "function")return filter(node);
}

if (typeof module !== "undefined" && module["exports"]) {
	module["exports"] = DelegateListener
} else if (typeof global !== "undefined") {
	global["DelegateListener"] = DelegateListener
}

})(this);