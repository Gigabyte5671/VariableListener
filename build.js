const fs = require('fs');
const https = require('https');
const querystring = require('querystring');

const fileContent = fs.readFileSync('./src/variable-listener.js', { encoding: 'utf8' });

const query = querystring.stringify({ input: fileContent });

const request = https.request(
	{
		method   : 'POST',
		hostname : 'www.toptal.com',
		path     : '/developers/javascript-minifier/api/raw'
	},
	(response) => {
		if (response.statusCode !== 200) {
			console.log('Failed to build:' + response.statusCode);
			return;
		}

		let minifiedContent = '';

		response.on('data', (chunk) => { minifiedContent += chunk; });

		response.on('end', () => {
			fs.writeFileSync('./dist/variable-listener.min.js', minifiedContent, { encoding: 'utf8' });
		});
	}
);
request.on('error', (error) => { throw error; });
request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
request.setHeader('Content-Length', query.length);
request.end(query, 'utf8');

fs.copyFileSync('./src/variable-listener.d.ts', './dist/variable-listener.min.d.ts');
