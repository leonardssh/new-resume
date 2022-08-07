const fs = require('fs-extra');
const Handlebars = require('handlebars');
const path = require('path');

const PARTIALS_DIR = 'src/partials';

const render = (resume) => {
	const template = fs.readFileSync('src/resume.hbs', 'utf-8');
	const css = fs.readFileSync('assets/css/theme.css', 'utf-8');
	const partials = fs.readdirSync(PARTIALS_DIR);

	partials.forEach((partial) => {
		const matches = /^([^.]+).hbs$/.exec(partial);

		if (!matches) {
			return;
		}

		const [, partialName] = matches;
		const filePath = path.join(PARTIALS_DIR, partial);
		const partialTemplate = fs.readFileSync(filePath, 'utf8');

		Handlebars.registerPartial(partialName, partialTemplate);
	});

	return Handlebars.compile(template)({
		css,
		resume
	});
};

module.exports = {
	render
};
