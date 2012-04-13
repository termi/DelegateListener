# DelegateListener

## Dependencies
`Element.prototype.matchesSelector` shim.
It coudth be found in https://gist.github.com/2369850

## Example

```javascript
document.addEventListener(type, new DelegateListener(".player", callback))
```

## Licence
MIT