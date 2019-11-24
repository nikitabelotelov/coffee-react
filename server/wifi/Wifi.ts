import { IWifiNet } from "../../src/types";

const Wifi = require("node-wifi")

Wifi.init({
    iface: null
});

export function getWifiNetworks(): Promise<Array<IWifiNet>> {
    let result = new Promise<Array<IWifiNet>>((resolve) => {
        Wifi.scan((err: any, networks: Array<IWifiNet>) => {
            if(err) {
                console.error("Error while scanning wifi networks: " + err);
                resolve([]);
            } else {
                resolve(networks);
                console.log(networks.map((el) => el.ssid))
            }
        })
    })
    return result;
}

