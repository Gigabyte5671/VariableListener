# Variable Listener

Allows JavaScript to execute arbitrary functions when the value of any global variable changes.

To add a new listener:  
``` javascript
window.addVariableListener('variable_name', function () {
    /* do something */
});
```

To remove a listener:  
``` javascript
window.removeVariableListener('variable_name');
```
