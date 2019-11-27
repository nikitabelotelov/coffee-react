import { IWifiNet } from "../../src/types";
import { reject } from "q";
let Wifi: any;
if (process.arch === "arm") {
  try {
    Wifi = require("rpi-wifi");
  } catch (e) {
    console.log("Couldn't load rpi-wifi");
  }
} else {
  Wifi = require("node-wifi");
  Wifi.init({
    iface: null
  });
}

export function getWifiNetworks(): Promise<Array<IWifiNet>> {
  let result = new Promise<Array<IWifiNet>>(resolve => {
    Wifi.scan((err: any, networks: Array<IWifiNet>) => {
      if (err) {
        console.error("Error while scanning wifi networks: " + err);
        resolve([]);
      } else {
        if (process.arch === "arm") {
          resolve(
            networks.map(el => {
              return { ssid: el.essid };
            })
          );
        } else {
          resolve(networks);
        }
      }
    });
  });
  return result;
}

export function connectWifi(ssid: string, password: string): Promise<any> {
  return new Promise(resolve => {
    if (process.arch === "arm") {
      console.log('Wifi.addWpaDhcpNetwork')
      console.log('this.wpaSupplicantServiceInitiated=', this.wpaSupplicantServiceInitiated)
      console.log('this.wpasup._networks', this.wpasup._networks)
      console.log('this.wpasup._path', this.wpasup._path)
      Wifi.addWpaDhcpNetwork(
        ssid,
        password,
        function(err: any) {
          console.log('CALLBACK CALLED')
          if (err) {
            console.log("Couldn't add network " + ssid + " " + err);
            reject();
          }
          Wifi.connect(ssid, (err: any) => {
            if (err) {
              console.log("Couldn't connect to network " + ssid + " " + err);
            }
            resolve(true);
          });
        },
        "00:00:00:00:00:00"
      );
      
      console.log('after this.wpasup', this.wpasup._networks)
    }
    console.log("trying to connect " + ssid + " with password " + password);
    Wifi.connect({ ssid, password }, (err: any) => {
      console.log("Connect! " + ssid + " " + err, err);
      resolve();
    });
    Wifi.disconnect((a: any, b: any, c: any) => {
      console.log("DISCONNECT", a, b, c);
    });
  });
}
