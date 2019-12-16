import {exec} from "child_process"

function parseStatus(text: string): any {
	let content = text.split("\n");
	let current:any = {};

	if (!content.length) return null;
	content.forEach(function (item) {
		if (item.includes('ssid')) current.ssid = item.replace(/ssid=\s*/, '');
		else if (item.includes('wpa_state')) current.wpa_state = item.replace(/wpa_state=\s*/, '');
	});

	return current.wpa_state === 'COMPLETED' ? current : null;
}

function execCommand(program: string, args: string, callback: Function) {
    let command = program + ' ' + args;
    console.log("Trying to execute command: " + command)
    exec(command, (error, stdout, stderr) => {
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
    public status(callback: Function) {
        let command = this.path + ' status -i wlan0';
        exec(command, (error, stdout, stderr) => {
            if (stdout.includes("FAIL")) {
                console.error("Failed to proceed command: " + command + '\n' + stdout);
                callback(stdout);
            } else {
                callback(null, parseStatus(stdout));
            }
        });
    }
}
