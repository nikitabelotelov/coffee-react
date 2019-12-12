var fs = require('fs');

function WpaSupplicantService(path) {
	this._path = path ? path : '/etc/wpa_supplicant/wpa_supplicant.conf';
	this._conf = ['ctrl_interface=/var/run/wpa_supplicant'];
	this._networks = [];
}

function parseNetworkLine(line) {
	var key = line.substring(0, line.indexOf("="));
	key = key.replace(/^[\s|\t]+/, "").replace(/\s+$/, "");

	var value = line.substring(line.indexOf("=") + 1);
	value = value.replace(/^[\s|\t]+/, "").replace(/\s+$/, "");

	var ssid = (key == "ssid") ? value : null;

	return { key: key, value: value, ssid: ssid };
}

function quoteValue(value) {
	if (typeof (value) === 'string' && !(value.substring(0, 1) == '"') && !(value.substring(value.length - 1) == '"'))
		value = '"' + value + '"';

	return value;
}

//Public methods

WpaSupplicantService.prototype.init = function (callback) {
	this.parseConf(callback);
}

WpaSupplicantService.prototype.parseConf = function (callback) {
	this._conf = [];
	this._networks = [];
	var currentNetwork;
	var insideNetwork = false;

	var lineReader = require('readline').createInterface({
		input: fs.createReadStream(this._path)
	});

	lineReader.on('line', function (line) {
		if (!insideNetwork) {
			if (line.includes('network={')) {
				currentNetwork = {
					ssid: null,
					attrib: []
				};
				insideNetwork = true;
			} else {
				if (line != "")
					this._conf.push(line);
			}
		} else {
			if (line.includes('}')) {
				this._networks.push(currentNetwork);
				insideNetwork = false;
			} else {
				var networkLine = parseNetworkLine(line);
				if (networkLine.ssid) currentNetwork.ssid = networkLine.ssid;
				currentNetwork.attrib.push({ key: networkLine.key, value: networkLine.value });
			}
		}
	});

	lineReader.on('close', function () {
		callback();
	});
}

WpaSupplicantService.prototype.getNetworks = function () {
	return this._networks;
}

WpaSupplicantService.prototype.getNetworkIndex = function (ssid) {
	ssid = quoteValue(ssid);
	for (var i = 0; i < this._networks.length; i++) {
		if (this._networks[i].ssid == ssid) {
			return i;
		}
	}

	return -1;
}

WpaSupplicantService.prototype.getNetwork = function (ssid) {
	ssid = quoteValue(ssid);
	var index = this.getNetworkIndex(ssid);
	if (index != -1) {
		return this._networks[index];
	} else {
		return null;
	}
}

WpaSupplicantService.prototype.addNetwork = function (config) {
	for(var key in config) {
		if(config.hasOwnProperty(key)) {
			config[key] = quoteValue(config[key]);
		}
	}

	var network = {
		ssid: config.ssid,
		attrib: config
	};

	var index = this.getNetworkIndex(ssid);

	if (index != -1) {
		this._networks[index] = network;
	} else {
		this._networks.push(network);
	}
}

WpaSupplicantService.prototype.forgetNetwork = function (ssid, attrib) {
	ssid = quoteValue(ssid);
	var bssid = null;
	for (var i = 0; i < attrib.length; i++) {
		if (attrib[i].key == "ssid")
			attrib[i].value = quoteValue(attrib[i].value);
		if (attrib[i].key == "bssid")
			bssid = attrib[i].value;
	}

	var network = {
		ssid: ssid,
		attrib: attrib
	};


	var index = this.getNetworkIndex(ssid, bssid);

	if (index != -1) {
		this._networks.splice(index, 1);
	}
}

WpaSupplicantService.prototype.persist = function (callback) {
	var content = "";

	if (this._conf.length === 0) {
		this._conf.push('ctrl_interface=/var/run/wpa_supplicant\nupdate_config=1');
	}

	for (var i = 0; i < this._conf.length; i++) {
		content += this._conf[i] + "\n";
	}

	content += "\n";

	for (var i = 0; i < this._networks.length; i++) {
		content += "network={\n";
		for (var j = 0; j < this._networks[i].attrib.length; j++) {
			content += "\t" + this._networks[i].attrib[j].key + "=" + this._networks[i].attrib[j].value + "\n";
		}
		content += "}\n";
	}

	fs.unlink(this._path, function (uErr) {
		if (uErr) {
			console.log("Error unlinking '" + this._path + "' file");
			console.log(uErr);
			callback(uErr);
		} else {
			fs.writeFile(this._path, content, function (wErr) {
				if (wErr) {
					console.log("Error writting '" + this._path + "' file");
					console.log(wErr);
					callback(wErr);
				} else {
					callback();
				}
			});
		}
	});
}

module.exports = WpaSupplicantService;
