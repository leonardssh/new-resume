const fs = require('fs-extra');
const Handlebars = require('handlebars');
const path = require('path');

const render = (resume) => {
	const [templatePath, partialsPath, cssPath] = [
		path.join(process.cwd(), 'src', 'resume.hbs'),
		path.join(process.cwd(), 'src', 'partials'),
		path.join(process.cwd(), 'assets', 'css', 'theme.css')
	];

	const template = fs.readFileSync(templatePath, 'utf-8');
	const css = fs.readFileSync(cssPath, 'utf-8');
	const partials = fs.readdirSync(partialsPath);

	partials.forEach((partial) => {
		const matches = /^([^.]+).hbs$/.exec(partial);

		if (!matches) {
			return;
		}

		const [, partialName] = matches;
		const filePath = path.join(partialsPath, partial);
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
