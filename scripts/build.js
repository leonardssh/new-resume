const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const { render } = require('./helpers');
const { getResume } = require('./get-resume');

const OUTPUT_DIR = 'dist';

// DEBUG
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const main = async () => {
	const { stdout, stderr } = await exec('ls', ['a', '-l']);
	if (stderr) {
		console.log(stderr);
	}

	console.log('\n---\n');
	console.log(stdout);
	console.log('---\n');
};

main();
// DEBUG

const buildHTML = async () => {
	await fs.remove(OUTPUT_DIR);
	await fs.ensureDir(OUTPUT_DIR);

	const resume = await getResume();

	if (!resume) {
		throw new Error('Could not load resume');
	}

	console.log('Rendering...');
	const html = render(resume);

	console.log('Saving file...');
	fs.writeFileSync(`${OUTPUT_DIR}/index.html`, html, 'utf-8');

	console.log('Done');
	return html;
};

const buildPDF = async (html) => {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	console.log('Opening puppeteer...');
	await page.setContent(html, { waitUntil: 'networkidle0' });

	console.log('Generating PDF...');
	const pdf = await page.pdf({
		format: 'A4',
		displayHeaderFooter: false,
		printBackground: true,
		margin: {
			top: '0.4in',
			bottom: '0.4in',
			left: '0.4in',
			right: '0.4in'
		}
	});

	await browser.close();

	console.log('Saving file...');
	fs.writeFileSync('dist/resume.pdf', pdf);

	console.log('Done');
	return pdf;
};

async function buildAll() {
	const html = await buildHTML();
	await buildPDF(html);
}

buildAll().catch((e) => {
	console.error(e);
	process.exit(1);
});
