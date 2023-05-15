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

	// Compares two stringified objects. Stringification prevents false positives when accidentally comparing prototypes.
	function jsonCompare (jsonString, object) {
		return jsonString === JSON.stringify(object);
	}

	// Compares a variable's current value to its cached value.
	function variableHasChanged (variable, value) {
		return isObject(window[value]) ? !jsonCompare(window.variableListenerCache.get(variable)?.value, window[value]) : this.cache[value] !== window[value];
	}

	//The main entry point for VL. Accepts a variable name and a function, adds the variable to the cache and the task to VL.
	window.addVariableListener = (variableName, callback) => {
		if (!variableName || !window.hasOwnProperty(variableName)) {
			console.error("VL | Scope Error: Variable must be globally declared with 'var'.");
			return false;
		}
		if (!callback || typeof callback !== 'function') {
			console.error("VL | Argument Error: You must pass a function.");
			return false;
		}

		// Add the variable and its value to the cache.
		if (isObject(window[variableName])) {
			window.variableListenerCache.set(variableName, { value: JSON.stringify(window[variableName]), callback }); // If the value is an object, stringify it to remove inheritance.
		} else {
			window.variableListenerCache.set(variableName, { value: window[variableName], callback });
		}
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
				if (isObject(window[variable])) {
					data.value = JSON.stringify(window[variable]) // If the value is an object, stringify it to remove inheritance.
				} else {
					data.value = window[variable];
				}
				data.callback?.(); // Execute the function.
			}
		});
		window.requestAnimationFrame(loop);
	}
	loop();
})();
