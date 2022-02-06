var VL = {
	//Stores a copy of all registered variables, allowing the stored value to be compared to the current value.
	cache: {},


	//Loops through and executes all assigned tasks. 
	loop: function () {
		Object.keys(this).forEach((f) => {
			if(f.toString().substring(0, 5) === 'task_'){
				if(this.variableHasChanged(f.toString().split('task_')[1])){
					this.cache[f.toString().split('task_')[1]] = window[f.toString().split('task_')[1]];
					this[f](); //Execute the function
				}
			}
		});
		window.requestAnimationFrame(this.loop.bind(this));
	},


	//Compares a variable's current value to its cached value.
	variableHasChanged: function (v) {
		return this.cache[v] !== window[v];
	},


	//The main entry point for VL. Accepts a variable name and a function, adds the variable to the cache and the task to VL.
	add: function (v, f) {
		if(!v || typeof window[v] == 'undefined'){
			console.error("Scope Error: Variable must be globally declared with 'var'.");
			return false;
		}else if(!f){
			console.error("Argument Error: You must pass a function along with the variable.");
			return false;
		}else{
			this.cache[v] = window[v]; //Add the variable and its value to the cache.
			this[`task_${v}`] = f; //Add the function to VL as a task.
			return true;
		}
	},


	//Removes a listener from VL.
	remove: function (v) {
		if(this.cache[v]){
			delete this.cache[v]; //Delete the varible from the cache.
			delete this[`task_${v}`]; //Remove the function from VL.
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
