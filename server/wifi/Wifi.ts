import { IWifiNet } from "../../src/types"
import RaspbianWifiManager from "./rpi/RaspbianWifiManager"
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
        return new Promise<Array<IWifiNet>>((resolve) => {
            Wifi.scan((err: any, networks: Array<IWifiNet>) => {
                if(err) {
                    console.error("Error while scanning wifi networks: " + err);
                    resolve([]);
                } else {
                    resolve(networks)
                }
            })
        })
    }
    static connectWifi(ssid: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if(isArm()) {
                Wifi.addWpaDhcpNetwork(ssid, password, function(err: any) {
                    if (err) {
                        reject();
                    }
                    Wifi.connect(ssid, (err: any) => {
                        if (err) {
                            reject();
                        }
                        console.log("Wifi connected " + ssid)
                        resolve()
                    });
                });
            } else {
                Wifi.connect({ssid, password}, {}, (err: any) => {
                    if (err) {
                        reject();
                    }
                    console.log("Wifi connected " + ssid)
                    resolve()
                })
            }
        })
    }
}
