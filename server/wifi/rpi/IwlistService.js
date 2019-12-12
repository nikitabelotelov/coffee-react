var exec = require('child_process').exec;

function IwlistService (path) {
	this._path = path ? path : 'iwlist';
}

//Private methods

function parseIwlist (text) {
	var content = text.split("\n");
	content.splice(0,1);

	var cellRegEx = /^[\s|\t]*Cell/;

	var networks = [];

	var cellContent = [];
	for (var i = 0; i < content.length; i++) {
		if (cellRegEx.test(content[i])) {
			var n = parseCell(cellContent);
			if (n) networks.push(n);
			cellContent = [];
			cellContent.push(content[i]);
		} else {
			cellContent.push(content[i]);
		}
	}
	var n = parseCell(cellContent);
	if (n) networks.push(n);

	return networks;
}

function parseCell (cellContent) {
	if (cellContent.length == 0) return null;
	var network = {};

	cellContent.forEach(function(cell) {
		if (cell.includes('Address:')) network.address = cell.replace(/.*Address:\s*/, '');
		else if (cell.includes('Channel:')) network.channel = cell.replace(/.*Channel:\s*/, '');
		else if (cell.includes('Frequency:')) network.frequency = cell.match(/Frequency:\s*\d+(.\d+)*\sGHz/)[0].replace(/Frequency:\s*/,'');
		else if (cell.includes('Quality')) {
			network.quality = cell.match(/=(\d+)/)[0].replace(/=/, '');
			network.max_quality = cell.match(/\/(\d+)/)[0].replace(/\//, '');
			if (cell.includes('Signal level'))  network.signal_level = cell.match(/Signal level=\s*([-]*\d+)/)[0].replace(/Signal level=\s*/,'');
		} 
		else if (cell.includes('Encryption key:')) network.encryption_key = cell.replace(/.*Encryption key:\s*/, '');
		else if (cell.includes('ESSID:')) network.ssid = cell.replace(/.*ESSID:/, '').replace(/"/g,'');

		if (network.encryption_key === 'on') {
			if (cell.includes('IEEE')) {
		 		network.encryption_type = /\/\w+\d*/.test(cell) ? cell.match(/\/\w+\d*/)[0].replace(/\//, '') : 'WEP';
		 	}
		}
	});

	return network;
}

//Public methods

IwlistService.prototype.scan = function (callback, interfaceName) {
	interfaceName = interfaceName ? interfaceName : 'wlan0';

	var command = this._path + ' ' + interfaceName + ' scan';
	exec(command, (error, stdout, stderr) => {
		if (error) {
			callback(error);
		} else {
			var networks = parseIwlist (stdout);
			callback(null, networks);
		}
	});
}

module.exports = IwlistService;
