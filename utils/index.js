const fs = require('fs');
const { exec } = require('child_process');

module.exports.removeAccents = str => {
	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

module.exports.encodeBase64 = str => {
	return Buffer.from(str).toString('base64');
}

module.exports.jsonConfig = function(fileName, { defaultConfigContent, defaultConfigFile, onChange }) {
	this.file = fileName;
	this.json = null;
	this.defaultConfigContent = defaultConfigContent;
	this.defaultConfigFile = defaultConfigFile;
	this.read = () => {
		if (!fs.existsSync(this.file))
			this.write();
		this.json = JSON.parse(fs.readFileSync(this.file));
		return this.json;
	}
	this.write = () => {
		if (this.json === null && this.defaultConfigContent !== undefined)
			fs.writeFileSync(this.file, typeof this.defaultConfigContent === 'object' ? JSON.stringify(this.defaultConfigContent) : this.defaultConfigContent);
		if (this.json === null && this.defaultConfigFile !== undefined)
			fs.writeFileSync(this.file, fs.readFileSync(this.defaultConfigFile));
		else if (this.json === null)
			fs.writeFileSync(this.file, "{}");
		else
			fs.writeFileSync(this.file, JSON.stringify(this.json));
		return this.json;
	}
	fs.watchFile(fileName, () => {
		this.read();
		if (onChange !== undefined)
			onChange(this);
	});
}

module.exports.playSound = (filePath) => {
	return new Promise((resolve, reject) => {
		exec(`sox ${filePath} -d`, (err, stdout, stderr) => {
			resolve();
		});
	});
}