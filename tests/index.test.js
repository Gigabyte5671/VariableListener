require('../src/variable-listener');

async function unit (variableName, initialValue, updatedValue) {
	return new Promise((resolve, reject) => {
		// Set the global variable.
		globalThis[variableName] = initialValue;

		// Update it after 3 seconds.
		globalThis.setTimeout(() => {
			globalThis[variableName] = updatedValue;
		}, 3000);
	
		// Listen to the variable.
		globalThis.addVariableListener(variableName, (newValue) => {
			// Remove the listener.
			globalThis.removeVariableListener(variableName);
			// Check the new value.
			newValue === updatedValue ? resolve() : reject();
		});

		// Reject if the variable hasn't been updated after 5 seconds.
		globalThis.setTimeout(() => {
			reject();
		}, 5000);
	});
}

async function integration () {
	await unit('testArray', [ false, 12, '' ], [ false, 15, '' ]);
	console.log('Array test passed.');

	await unit('testBoolean', false, true);
	console.log('Boolean test passed.');

	await unit('testNumber', 0, 1024);
	console.log('Number test passed.');

	await unit('testObject', { nest1: { nest2: 'Egg' } }, { nest1: { nest2: 'Egg', nest3: 'Bird' } });
	console.log('Object test passed.');

	await unit('testString', 'Unit tests are awesome!', 'Integration tests are awesome!');
	console.log('String test passed.');

	await unit('testUndefined', undefined, null);
	console.log('Undefined test passed.');
}
integration();
