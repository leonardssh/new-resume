const axios = require('axios');
const fs = require('fs');

const RESUME = 'resume.json';
const RESUME_GIST = 'leonardssh/d72297eb48abfad33e70e1313cd35614';
const RESUME_GIST_URL = `https://gist.githubusercontent.com/${RESUME_GIST}/raw/resume.json`;

const downloadResume = async () => {
	const { data } = await axios(RESUME_GIST_URL);

	const resume = JSON.stringify(data, null, 2);

	console.log('Saving resume...');
	fs.writeFileSync(RESUME, resume, 'utf-8');

	return resume;
};

const getResume = async () => {
	if (!fs.existsSync(RESUME)) {
		console.log(`Downloading resume... [${RESUME_GIST}]`);
		const resume = await downloadResume(RESUME_GIST_URL);
		return JSON.parse(resume);
	}

	console.log(`Loading from locale "${RESUME}"`);
	const resume = JSON.parse(fs.readFileSync(RESUME, 'utf-8'));

	return resume;
};

module.exports = { getResume };
