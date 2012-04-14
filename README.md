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
	paste : function() {},
	handler : function(node) {
        var operation = node.getAttrubute("data-menu-event"),//"copy" or "paste" or null
            function = operation && this[operation];

        if(function) {
            function.call(this, node);
            return true;
        }
    }
}

document.addEventListener("click", DelegateListener(
	editorController.handler.bind(editorController),
    function(){return false}
));
```

## Licence
MIT