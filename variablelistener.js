var VL = {
	//Stores a copy of all registered variables, allowing the stored value to be compared to the current value.
	cache: {},


	//Loops through and executes all assigned tasks. 
	loop: function () {
		let v;
		Object.keys(this).forEach((f) => {
			if(f.toString().substring(0, 5) === 'task_'){
				v = f.toString().split('task_')[1];
				if(this.variableHasChanged(v)){
					//Update the cached value.
					if(this.isObject(window[v])){
						this.cache[v] = JSON.stringify(window[v]); //If the value is an object, stringify it to remove inheritance.
					}else{
						this.cache[v] = window[v];
					}
					this[f](); //Execute the function.
				}
			}
		});
		window.requestAnimationFrame(this.loop.bind(this));
	},


	//Checks if a variable is an object, excluding array and null. If so, it needs to be treated differently to avoid inheritance.
	isObject: function (v) {
		if(
			typeof v === 'object' &&
			!Array.isArray(v) &&
			v !== null
		){
			return true;
		}else{
			return false;
		}
	},


	//Compares two stringified objects. Stringification prevents false positives from accidentally comparing prototypes.
	jsonCompare: function (jsonString, object) {
		return jsonString === JSON.stringify(object);
	},


	//Compares a variable's current value to its cached value.
	variableHasChanged: function (v) {
		return this.isObject(window[v]) ? !this.jsonCompare(this.cache[v], window[v]): this.cache[v] !== window[v];
	},


	//The main entry point for VL. Accepts a variable name and a function, adds the variable to the cache and the task to VL.
	add: function (v, f) {
		if(!v || typeof window[v] == 'undefined'){
			console.error("VL | Scope Error: Variable must be globally declared with 'var'.");
			return false;
		}else if(!f){
			console.error("VL | Argument Error: You must pass a function.");
			return false;
		}else{
			//Add the variable and its value to the cache.
			if(this.isObject(window[v])){
				this.cache[v] = JSON.stringify(window[v]); //If the value is an object, stringify it to remove inheritance.
			}else{
				this.cache[v] = window[v];
			}
			this[`task_${v}`] = f; //Add the function to VL as a task.
			return true;
		}
	},


	//Removes a listener from VL.
	remove: function (v) {
		if(this.cache[v]){
			delete this[`task_${v}`]; //Remove the function from VL.
			delete this.cache[v]; //Delete the varible from the cache.
			return true;
		}else{
			return false;
		}
	},


	//Starts listening for changes on all registered variables.
	init: function () {
		window.requestAnimationFrame(this.loop.bind(this));
		return true;
	}
};
