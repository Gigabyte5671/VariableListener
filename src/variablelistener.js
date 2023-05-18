(function () {
	if (!window) return;

	// Stores a copy of all registered variables, allowing the stored value to be compared to the current value.
	window.variableListenerCache = new Map();

	// Normalize object/array values to primative types to remove inheritance.
	function normalizeValue (value) {
		return value && typeof value === 'object' ? JSON.stringify(value) : value;
	}

	// Compares a variable's current value to its cached value.
	function variableHasChanged (variable, value) {
		return normalizeValue(value) !== normalizeValue(window[variable]);
	}

	// Add a new variable listener. Accepts a variable name and a function to be called whenever the variable changes.
	window.addVariableListener = (variable, callback) => {
		if (
			!variable
			|| !callback
			|| typeof callback !== 'function'
			|| !window.hasOwnProperty(variable)
		) return;
		// Add the variable and its value to the cache.
		window.variableListenerCache.set(variable, {
			value: normalizeValue(window[variable]),
			callback
		});
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
				data.value = normalizeValue(window[variable]);
				// Execute the function.
				data.callback?.();
			}
		});
		window.requestAnimationFrame(loop);
	}
	loop();
})();
