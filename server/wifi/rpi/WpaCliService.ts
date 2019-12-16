import {exec} from "child_process"
import { logger } from "../../../src/logger";
import { IWifiStatus, WIFI_STATUS } from "../../../src/types";
import { isRegExp } from "util";

function parseStatus(text: string): IWifiStatus {
	let content = text.split("\n");
    let ssid: string = null;
    let currentWpaState: string;
    let wifiStatus: WIFI_STATUS;

	if (!content.length) return null;
	content.forEach(function (item) {
		if (item.includes('ssid')) ssid = item.replace(/ssid=\s*/, '');
		else if (item.includes('wpa_state')) currentWpaState = item.replace(/wpa_state=\s*/, '');
	});
    wifiStatus = currentWpaState === 'COMPLETED' ? WIFI_STATUS.CONNECTED : WIFI_STATUS.NOT_CONNECTED;
    if(ssid !== null) {
        return {wifiStatus, currentWifiNet:{ssid}}
    } else {
        return {wifiStatus}
    }
}

function execCommand(program: string, args: string, callback: Function) {
    let command = program + ' ' + args + ' -i wlan0';
    logger.log("Trying to execute command: " + command)
    exec(command, (error, stdout, stderr) => {
        logger.log("Out logs for command '" + command + "'\n"  + stdout)
        if (stdout.includes("FAIL")) {
            console.error("Failed to proceed command: " + command + '\n' + stdout);
            callback(stdout);
        } else {
            callback();
        }
    });
}

export default class WpaCliService {
    private path: string
    constructor() {
        this.path = 'wpa_cli';
    }
    public reconfigure(callback: Function) {
        execCommand(this.path, 'reconfigure', callback)
    }
    public disconnect(callback: Function) {
        execCommand(this.path, 'disconnect', callback)
    }
    public reconnect(callback: Function) {
        execCommand(this.path, 'reconnect', callback)
    }
    public selectNetwork(id: number, callback: Function) {
        execCommand(this.path, 'select_network ' + id, callback)
    }
    public status(): Promise<IWifiStatus> {
        return new Promise((resolve, reject) => {
            let command = this.path + ' status -i wlan0';
            exec(command, (error, stdout, stderr) => {
                if (stdout.includes("FAIL")) {
                    console.error("Failed to proceed command: " + command + '\n' + stdout)
                    reject(stdout)
                } else {
                    resolve(parseStatus(stdout))
                }
            });
        })
    }
}
