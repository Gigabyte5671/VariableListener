# Variable Listener JS

Allows client-side JavaScript to execute arbitrary functions when the value of any global variable changes.

To add a new listener:  
``` javascript
VL.add('variable_name', function(){
    /* do something */
});
```


To remove a listener:  
``` javascript
VL.remove('variable_name');
```


To start listening:  
``` javascript
VL.start();
```