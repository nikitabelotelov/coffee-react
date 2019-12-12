var WpaCliService = require('./WpaCliService.js');
var IwlistService = require('./IwlistService.js');
var WpaSupplicantService = require('./WpaSupplicantService.js');

/**
 * 
 * @param {string} interfaceName 
 */
function RaspbianWifiManager(interfaceName) {
	this.wpacli = new WpaCliService();
	this.iwlist = new IwlistService();
	this.wpasup = new WpaSupplicantService();
	this._wpasupInited = false;
	this.interfaceName = interfaceName ? interfaceName : 'wlan0';
}

RaspbianWifiManager.prototype.init = function () {
	var promiseResult = new Promise((resolve) => {
		this.wpasup.init(() => {
			this._wpasupInited = true;
			console.log('Parsed wpa config: \n' + this.wpasup._conf)
			resolve();
			//TODO add errback
		});
	});
	var promiseTimeout = new Promise((resolve, reject) => {
		setTimeout(() => {
			if (!this._wpasupInited) {
				console.error("Couldn't init wpasup");
				reject();
			}
		}, 5000);
	});
	return Promise.race([promiseResult, promiseTimeout]);
}

RaspbianWifiManager.prototype.status = function () {
	return new Promise((resolve, reject) => {
		this.wpacli.status(function(err, current) {
			if (err) {
				reject(err);
			} else {
				var response = {
					connected: !!current && current.wpa_state.includes('COMPLETED'), 
					network: current
				};
				resolve(response);
			}
		});
	});
}

RaspbianWifiManager.prototype.scan = function (callback, interfaceName) {
	return new Promise((resolve, reject) => {
		this.iwlist.scan((err, networks) => {
			if (err) {
				reject("Couldn't scan for networks: " + err);
			} else {
				resolve(networks)
			}
		}, interface);
	});
}

RaspbianWifiManager.prototype.addWpaDhcpNetwork = function (config) {
	return new Promise((resolve, reject) => {
		this.wpasup.addNetwork(config);
		this.wpasup.persist(function (err) {
			if(err) {
				reject(err);
			} else {
				this.wpacli.reconfigure(function (err) {
					if(err) {
						reject(err)
					} else {
						resolve();
					}
				});
			}
		});
	});
}

RaspbianWifiManager.prototype.forgetWpaDhcpNetwork = function (ssid, callback, bssid) {
	var attrib = [
		{ key: 'ssid', value: ssid }
	];

	if (bssid) attrib.push({ key: 'bssid', value: bssid });

	wpasup.forgetNetwork(ssid, attrib);

	wpasup.persist(function (err) {
		wpacli.reconfigure(function (err) {
			callback(err);
		});
	});
}

RaspbianWifiManager.prototype.getKnownNetworks = function (callback) {
	if (!this.wpaSupplicantServiceInitiated) {
		setTimeout(self.getKnownNetworks.bind(null, callback), 1000);
	} else {
		callback(this.wpasup.getNetworks());
	}
}

RaspbianWifiManager.prototype.disconnect = function (callback) {
	wpacli.disconnect(function (err) {
		callback(err);
	});
}

RaspbianWifiManager.prototype.connect = function (ssid) {
	return new Promise((resolve, reject) => {
		var index = this.wpasup.getNetworkIndex(ssid);
		if(!~index) {
			reject("Unknown network. You should add network auth data before trying to connect");
		}
		this.wpacli.selectNetwork(index, function (err) {
			if(err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

module.exports = RaspbianWifiManager;
