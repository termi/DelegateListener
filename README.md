# DelegateListener

## Dependencies
`Element.prototype.matchesSelector` shim.
It coudth be found in https://gist.github.com/2369850

## Example

```javascript
//Filtering by class
document.addEventListener("click", new DelegateListener(".player", callback))
//Filtering by attribute value
document.addEventListener("click", new DelegateListener({"data-event" : "click"}, callback))
//Filtering by attribute exists
document.addEventListener("click", new DelegateListener({"data-is-menu" : void 0}, callback))
//Filtering by custom filter
document.addEventListener("click", new DelegateListener(
	function(node) {
    	return node.contains(someOtherNode);
    },
	callback)
)
```

## Licence
MIT