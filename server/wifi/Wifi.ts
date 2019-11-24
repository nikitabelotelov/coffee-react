import { IWifiNet } from "../../src/types";
let Wifi:any;
if(process.arch === 'arm') {
    Wifi = require("rpi-wifi")
} else {
    Wifi = require("node-wifi")
    Wifi.init({
        iface: null
    });
}

export function getWifiNetworks(): Promise<Array<IWifiNet>> {
    let result = new Promise<Array<IWifiNet>>((resolve) => {
        Wifi.scan((err: any, networks: Array<IWifiNet>) => {
            if(err) {
                console.error("Error while scanning wifi networks: " + err);
                resolve([]);
            } else {
                resolve(networks);
            }
        })
    })
    return result;
}

