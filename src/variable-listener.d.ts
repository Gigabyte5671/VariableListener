export {};

declare global {
	interface globalThis {
		/**
		 * Add a new variable listener.
		 * @param variable The name of the global variable to listen to.
		 * @param callback A function to be called whenever the value of the variable changes. The variable's new value will be passed to this function.
		 */
		addVariableListener <T extends keyof globalThis> (variable: T, callback: (newValue: globalThis[T]) => (void | Promise<void>)): void;
		/**
		 * Remove a variable listener.
		 * @param variable The name of the global variable to stop listening to.
		 */
		removeVariableListener (variable: keyof globalThis): void;
	}
	interface Window {
		/**
		 * Add a new variable listener.
		 * @param variable The name of the global variable to listen to.
		 * @param callback A function to be called whenever the value of the variable changes. The variable's new value will be passed to this function.
		 */
		addVariableListener <T extends keyof Window> (variable: T, callback: (newValue: Window[T]) => (void | Promise<void>)): void;
		/**
		 * Remove a variable listener.
		 * @param variable The name of the global variable to stop listening to.
		 */
		removeVariableListener (variable: keyof Window): void;
	}
}
