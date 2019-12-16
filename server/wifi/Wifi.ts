import { IWifiNet } from "../../src/types"
import RaspbianWifiManager from "./rpi/RaspbianWifiManager"
import { logger } from "../../src/logger";
function isArm(): boolean {
   return process.arch === 'arm' 
}

let Wifi:any;
if(isArm()) {
    Wifi = new RaspbianWifiManager();
    Wifi.init()
} else {
    Wifi = require('node-wifi')
    Wifi.init({
        iface: null
    })
}

export class WifiManager {
    static getAvailableNetworks(): Promise<Array<IWifiNet>> {
        if(isArm()) {
            return  Wifi.scan();
        } else {
            return new Promise<Array<IWifiNet>>((resolve) => {
                Wifi.scan((err: any, networks: Array<IWifiNet>) => {
                    if(err) {
                        logger.error("Error while scanning wifi networks: " + err);
                        resolve([]);
                    } else {
                        resolve(networks)
                    }
                })
            })
        }
    }
    static connectWifi(ssid: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if(isArm()) {
                Wifi.addWpaDhcpNetwork(ssid, password).then(() => {
                    logger.log("Trying to select network: " + ssid)
                    Wifi.connect(ssid, (err: any) => {
                        if (err) {
                            reject();
                        }
                        logger.log("Wifi connected " + ssid)
                        resolve()
                    });
                });
            } else {
                Wifi.connect({ssid, password}, {}, (err: any) => {
                    if (err) {
                        reject();
                    }
                    logger.log("Wifi connected " + ssid)
                    resolve()
                })
            }
        })
    }
}
