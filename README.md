# DelegateListener

## Dependencies
`Element.prototype.matchesSelector` shim.
It coudth be found in https://gist.github.com/2369850

## Example

```javascript
//Filtering by class
document.addEventListener("click", new DelegateListener(".player", callback))
//Filtering by attribute value
document.addEventListener("click", DelegateListener({"data-event" : "click"}, callback))
//Filtering by attribute exists
document.addEventListener("click", DelegateListener({"data-is-menu" : void 0}, callback))
//Filtering by custom filter
document.addEventListener("click", DelegateListener(
	function(node) {
    	return node.contains(someOtherNode);
    },
	callback)
)

//Using filter instead of callback
var editorController = {
	copy : function() {},
	past : function() {},
	handler : function(node) {
    	swicth(node.getAttrubute("data-menu-event")) {
    		case "copy":
    			this.copy();
    		breal;
    		case "past":
    			this.copy();
    		breal;
    		return false;
    	}
    }
}

document.addEventListener("click", DelegateListener(
	editorController.handler.bind(editorController)
));
```

## Licence
MIT