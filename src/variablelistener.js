(function () {
	if (!window) {
		return;
	}

	// Stores a copy of all registered variables, allowing the stored value to be compared to the current value.
	window.variableListenerCache = new Map();

	// Checks if a variable is an object literal. If so, it needs to be treated differently to avoid inheritance.
	function isObject (value) {
		return value && typeof value === 'object' && !Array.isArray(value);
	}

	// Compares a variable's current value to its cached value.
	function variableHasChanged (variable, value) {
		return isObject(window[value]) ? window.variableListenerCache.get(variable)?.value !== JSON.stringify(window[value]) : this.cache[value] !== window[value];
	}

	// Add a new variable listener. Accepts a variable name and a function to be called whenever the variable changes.
	window.addVariableListener = (variable, callback) => {
		if (
			!variable
			|| !callback
			|| typeof callback !== 'function'
			|| !window.hasOwnProperty(variable)
		) {
			return false;
		}

		// Add the variable and its value to the cache.
		window.variableListenerCache.set(variable, {
			value: isObject(window[variable]) ? JSON.stringify(window[variable]) : window[variable],
			callback
		});
		return true;
	};

	// Removes a listener.
	window.removeVariableListener = (variable) => {
		window.variableListenerCache.delete(variable);
	};

	// Starts listening for changes on all registered variables.
	function loop () {
		window.variableListenerCache.forEach((variable, data) => {
			if (variableHasChanged(variable)) {
				// Update the cached value.
				data.value = isObject(window[variable]) ? JSON.stringify(window[variable]) : window[variable];
				// Execute the function.
				data.callback?.();
			}
		});
		window.requestAnimationFrame(loop);
	}
	loop();
})();
