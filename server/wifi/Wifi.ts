import { IWifiNet } from "../../src/types";

function isArm(): boolean {
   return process.arch === 'arm' 
}

let Wifi:any;
if(isArm()) {
    try {
        Wifi = require("./rpi/RaspbianWifiManager")
    } catch(e) {
        console.log("Couldn't load rpi-wifi")
    }
} else {
    Wifi = require("node-wifi")
    Wifi.init({
        iface: null
    })
}

export class WifiManager {
    wifiAPI: any
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
                console.log("Trying to add " + ssid + " with password " + password)
                Wifi.addWpaDhcpNetwork(ssid, password, function(err: any) {
                    if (err) {
                        console.log("Couldn't add network " + ssid + ' ' + err);
                        reject();
                    }
                    console.log("Trying to connect " + ssid + " with password " + password)
                    Wifi.connect(ssid, (err: any) => {
                        if (err) {
                            console.log("Couldn't connect to network " + ssid + ' ' + err);
                            reject();
                        }
                        resolve()
                    });
                });
            } else {
                console.log("Trying to connect " + ssid + " with password " + password)
                Wifi.connect({ssid, password}, {}, (err: any) => {
                    if (err) {
                        console.log("Couldn't connect to network " + ssid + ' ' + err);
                        reject();
                    }
                    console.log("Wifi connected " + ssid + " with password " + password)
                    resolve()
                })
            }
        })
    }
}
