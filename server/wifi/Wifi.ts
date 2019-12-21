import { IWifiNet, IWifiStatus } from "../../src/types"
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
            return Wifi.scan();
        } else {
            return new Promise<Array<IWifiNet>>((resolve) => {
                Wifi.scan((err: any, networks: Array<IWifiNet>) => {
                    resolve(networks)
                })
            })
        }
    }
    static connectWifi(ssid: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if(isArm()) {
                Wifi.addWpaDhcpNetwork(ssid, password).then(() => {
                    logger.log("Trying to select network: " + ssid)
                    Wifi.connect(ssid).then((err: any) => {
                        logger.log("Connected to network: " + ssid)
                        resolve()
                    });
                });
            } else {
                Wifi.connect({ssid, password}, {}, (err: any) => {
                    logger.log("Wifi connected " + ssid)
                    resolve()
                })
            }
        })
    }
    static status(): Promise<IWifiStatus> {
        if(isArm()) {
            return Wifi.status()
        } else {
            logger.warn("Checking net status only supported for wpa supplicant")
            return new Promise((res) => { res() })
        }
    }
}
