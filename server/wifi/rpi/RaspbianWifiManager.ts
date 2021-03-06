import WpaCliService from './WpaCliService'
import IwlistService from './IwlistService'
import WpaSupplicantService from './WpaSupplicantService'
import { logger } from '../../../src/logger'
import { IWifiStatus } from '../../../src/types'

export default class RaspbianWifiManager {
    protected wpacli: WpaCliService
    protected iwlist: IwlistService
    protected wpasup: WpaSupplicantService

    private wpasupInited: boolean
    private interfaceName: string

    constructor() {
        this.wpacli = new WpaCliService();
        this.iwlist = new IwlistService();
        this.wpasup = new WpaSupplicantService();
        this.wpasupInited = false;
        this.interfaceName = 'wlan0';
    }

    public init(): Promise<void> {
        return this.wpasup.init()
    }

    public status(): Promise<IWifiStatus> {
        return this.wpacli.status()
    }

    public scan(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.iwlist.scan((err: any, networks: any) => {
                resolve(networks)
            });
        });
    }

    public addWpaDhcpNetwork(ssid: string, psk: string): Promise<any> {
        return new Promise((resolve, reject) => {
            logger.log("Trying to add " + ssid)
            this.wpasup.addNetwork(ssid, psk)
            // @ts-ignore
            logger.log("Trying to persist: " + this.wpasup.configContent)
            this.wpasup.persist((err: any) => {
                logger.log("Persist callback called with result: " + err)
                if(!err) {
                    this.wpacli.reconfigure((err: any) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    }

    public connect(ssid: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let index: number = this.wpasup.getNetworkIndex(ssid);
            if (!~index) {
                reject("Unknown network. You should add network auth data before trying to connect");
            }
            logger.log("Trying to select " + ssid + ' with index ' + index);
            this.wpacli.selectNetwork(index, function (err: any) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

// RaspbianWifiManager.prototype.forgetWpaDhcpNetwork = function (ssid, callback, bssid) {
// 	var attrib = [
// 		{ key: 'ssid', value: ssid }
// 	];

// 	if (bssid) attrib.push({ key: 'bssid', value: bssid });

// 	wpasup.forgetNetwork(ssid, attrib);

// 	wpasup.persist(function (err) {
// 		wpacli.reconfigure(function (err) {
// 			callback(err);
// 		});
// 	});
// }

// RaspbianWifiManager.prototype.getKnownNetworks = function (callback) {
// 	if (!this.wpaSupplicantServiceInitiated) {
// 		setTimeout(self.getKnownNetworks.bind(null, callback), 1000);
// 	} else {
// 		callback(this.wpasup.getNetworks());
// 	}
// }

// RaspbianWifiManager.prototype.disconnect = function (callback) {
// 	wpacli.disconnect(function (err) {
// 		callback(err);
// 	});
// }

// RaspbianWifiManager.prototype.connect = function (ssid) {
// 	return new Promise((resolve, reject) => {
// 		var index = this.wpasup.getNetworkIndex(ssid);
// 		if(!~index) {
// 			reject("Unknown network. You should add network auth data before trying to connect");
// 		}
// 		this.wpacli.selectNetwork(index, function (err) {
// 			if(err) {
// 				reject(err);
// 			} else {
// 				resolve();
// 			}
// 		});
// 	});
// }
