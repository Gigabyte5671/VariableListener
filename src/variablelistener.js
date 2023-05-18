(function () {
	const global = typeof window !== 'undefined' ? window : globalThis; // Support client and server.
	if (!global) return;

	// Stores a copy of all registered variables, allowing the stored value to be compared to the current value.
	global.variableListenerCache = new Map();

	// Normalize object/array values to primative types to remove inheritance.
	function normalizeValue (value) {
		return value && typeof value === 'object' ? JSON.stringify(value) : value;
	}

	// Compares a variable's current value to its cached value.
	function variableHasChanged (variable, value) {
		return normalizeValue(value) !== normalizeValue(global[variable]);
	}

	// Add a new variable listener. Accepts a variable name and a function to be called whenever the variable changes.
	global.addVariableListener = (variable, callback) => {
		if (
			!variable
			|| !callback
			|| typeof callback !== 'function'
			|| !global.hasOwnProperty(variable)
		) return;
		// Add the variable and its value to the cache.
		global.variableListenerCache.set(variable, {
			value: normalizeValue(global[variable]),
			callback
		});
	};

	// Removes a listener.
	global.removeVariableListener = (variable) => global.variableListenerCache.delete(variable);

	// Starts listening for changes on all registered variables.
	function loop () {
		global.variableListenerCache.forEach((data, variable) => {
			if (variableHasChanged(variable, data.value)) {
				// Update the cached value.
				data.value = normalizeValue(global[variable]);
				// Execute the function.
				data.callback?.();
			}
		});
		typeof window !== 'undefined' ? global.requestAnimationFrame(loop) : global.setImmediate(loop);
	}
	loop();
})();
