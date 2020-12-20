const numberValues = {
	'un': 1,
	'deux': 2,
	'trois': 3,
	'quatre': 4,
	'cinq': 5,
	'six': 6,
	'sept': 7,
	'huit': 8,
	'neuf': 9,
	'dix': 10,
	'onze': 11,
	'douze': 12,
	'treize': 13,
	'quatorze': 14,
	'quinze': 15,
	'seize': 16,
	'dix sept': 17,
	'dix huit': 18,
	'dix neuf': 19,
	'vingt': 20,
	'trente': 30,
	'quarante': 40,
	'cinquante': 50,
	'soixante': 60,
	'soixante dix': 70,
	'quatre vingt': 80,
	'quatre vingt-dix': 90,
	'cent': 100
};
const dix = (strict, etUn = false, pasDeUn = false) => {
	if (pasDeUn)
		return `(deux|trois|quatre|cinq|six|sept|huit|neuf)`;
	else
		return `(${etUn ? `et${strict ? '-' : '[- ]'}un` : `un`}|deux|trois|quatre|cinq|six|sept|huit|neuf)`;
};
const vingt = (strict, etUn = false) => {
	return `(${etUn ? `et${strict ? '-' : '[- ]'}un` : `un`}|deux|trois|quatre|cinq|six|sept|huit|neuf|${etUn ? `et${strict ? '-' : '[- ]'}onze` : `onze`}|douze|treize|quatorze|quinze|seize|dix${strict ? '-' : '[- ]'}sept|dix${strict ? '-' : '[- ]'}huit|dix${strict ? '-' : '[- ]'}neuf|dix)`
};
const cent = (strict) => {
	return `((vingt|trente|quarante|cinquante)${strict ? '-' : '[- ]'}${dix(strict, true)}|((soixante)${strict ? '-' : '[- ]'}${vingt(strict, true)}|(quatre${strict ? '-' : '[- ]'}vingt)${strict ? '-' : '[- ]'}${vingt(strict)})|(vingt|trente|quarante|cinquante|soixante|quatre-vingts?)|${vingt(strict)})`;
};

module.exports.isNumber = (number) => {
	return !!(new RegExp('^' + cent(false) + '$')).exec(number.trim());
}
module.exports.parseNumber = (number) => {
	const match = (new RegExp('^' + cent(false) + '$')).exec(number.trim());
	if (number === 'cent')
		return 100;
	else if (match[10])
		return numberValues[match[10].replace(/-/g, ' ').trim()];
	else if (match[9])
		return numberValues[match[9].replace('quatre-vingts', 'quatre-vingt').replace(/-/g, ' ').trim()];
	else if ((match[5] && match[6]) || (match[7] && match[8]))
		return numberValues[(match[5] || match[7]).replace(/-/g, ' ').trim()] + numberValues[(match[6] || match[8]).replace('et onze', 'onze').replace('et un', 'un').replace(/-/g, ' ').trim()];
	else if (match[2] && match[3])
		return numberValues[match[2].replace(/-/g, ' ').trim()] + numberValues[match[3].replace('et onze', 'onze').replace('et un', 'un').replace(/-/g, ' ').trim()];
}