import { existsSync, createReadStream, unlink, writeFile, readFile } from "fs"
import { createInterface } from "readline"
import { IWifiNet } from "../../../src/types";

interface IParsedNetLine {
    key: string,
    value: string
}

function parseNetworkLine(line: string): IParsedNetLine {
    line = line.replace(/\s/ig, '')
    let [_, key, value] = /(.*?)=(.*)/.exec(line)
    if (/^"(.*?)"$/.test(value)) {
        value = value.slice(1, -1);
    }
    return { key, value };
}

function quoteValue(value: string): string {
    return /^"(.*)"$/.test(value) ? value : `"${value}"`
}

export default class WpaSupplicantService {
    private configPath: string
    private configContent: Array<string>
    private networks: Array<IWifiNet>
    constructor() {
        this.configPath = '/etc/wpa_supplicant/wpa_supplicant.conf'
        this.configContent = ['ctrl_interface=/var/run/wpa_supplicant', 'update_config=1'];
        this.networks = [];
    }
    public init(): Promise<void> {
        return new Promise((resolve) => {
            this.parseConfig(resolve)
        })
    }
    protected parseConfig(callback: Function) {
        if (existsSync(this.configPath)) {
            readFile(this.configPath, (err, buff) => {
                if (err) {
                    console.error("Error while reading wpa config: " + err)
                } else {
                    this.configContent = [];
                    this.networks = [];
                    let currentNetwork: IWifiNet;
                    let insideNetwork = false;
                    buff.toString().split('\n').filter((el) => !!el).forEach((line) => {
                        if (!insideNetwork) {
                            if (line.includes('network={')) {
                                currentNetwork = {
                                    ssid: null
                                };
                                insideNetwork = true;
                            } else {
                                if (line)
                                    this.configContent.push(line);
                            }
                        } else {
                            if (line.includes('}')) {
                                this.networks.push(currentNetwork)
                                insideNetwork = false
                            } else {
                                var networkLine = parseNetworkLine(line)
                                if (networkLine.key === 'ssid') {
                                    currentNetwork.ssid = networkLine.value
                                } else if (networkLine.key === 'psk') {
                                    currentNetwork.psk = networkLine.value
                                }
                            }
                        }
                    })
                    callback();
                }
            })
        } else {
            console.warn('Initial config wasn\'t found!')
            setTimeout(callback)
        }
    }
    public getNetworks(): Array<any> {
        return this.networks
    }
    public getNetworkIndex(ssid: string): number {
        return this.networks.findIndex((el) => el.ssid === ssid)
    }
    public getNetwork(ssid: string): any {
        ssid = quoteValue(ssid)
        var index = this.getNetworkIndex(ssid)
        if (index != -1) {
            return this.networks[index]
        } else {
            return null
        }
    }
    public addNetwork(ssid: string, psk: string) {
        let network: IWifiNet = { ssid, psk }
        var index = this.getNetworkIndex(ssid)
        if (index != -1) {
            this.networks[index] = network
        } else {
            this.networks.push(network)
        }
    }
    public forgetNetwork(ssid: string) {
        let index = this.getNetworkIndex(ssid);
        if (index != -1) {
            this.networks.splice(index, 1);
        }
    }
    public persist(callback: Function) {
        let content = "";
        for (var i = 0; i < this.configContent.length; i++) {
            content += this.configContent[i] + "\n";
        }
        content += "\n";
        content += this.networks.reduce((result, el) => {
            return result += `network={\n   ssid="${el.ssid}"\n   psk="${el.psk}"\n   key_mgmt=WPA-PSK\n}\n`;
        }, '');

        if (existsSync(this.configPath)) {
            unlink(this.configPath, () => {
                console.log("Config successfuly removed.")
                this.writeConfigFile(this.configPath, content, callback)
            });
        } else {
            this.writeConfigFile(this.configPath, content, callback)
        }
    }
    protected writeConfigFile(path: string, content: string, cb: Function) {
        writeFile(this.configPath, content, (wErr) => {
            if (wErr) {
                console.log("Error writting '" + this.configPath + "' file: " + wErr);    
            }
            console.log("Trying to call write callback with " + wErr)
            cb(wErr);
        });
    }
}