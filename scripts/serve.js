const http = require('http');
const { render } = require('./helpers');
const { getResume } = require('./get-resume');

const PORT = 8888;

const httpServer = http.createServer(async (req, res) => {
	if (req.url === '/') {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});

		const resume = await getResume();

		if (!resume) {
			throw new Error('Could not load resume');
		}

		const template = await render(resume);
		res.end(template);
	}
});

httpServer.listen(PORT, () => {
	console.log(`Preview: http://localhost:${PORT}/`);
	console.log('Serving..');
});
