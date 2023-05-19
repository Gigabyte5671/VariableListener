# Variable Listener

Allows JavaScript to execute arbitrary functions when the value of any global variable changes.


## Installation

To add Variable Listener to your site or project:
```html
<script src="https://cdn.jsdelivr.net/npm/variable-listener@latest/dist/variable-listener.min.js"></script>
```

or

```bash
npm install variable-listener
```

```javascript
import 'variable-listener';
```


## Usage

Declare your global variable:
```javascript
var count = 10;
```

Add a new listener:
``` javascript
window.addVariableListener('count', function (newValue) {

    console.log(newValue);

});
```

The callback will be triggered whenever your variable changes:
```javascript
count++;

// Callback logs: 11
```


If you no longer want to listen to the variable, call:
``` javascript
window.removeVariableListener('count');
```
