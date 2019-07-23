var mockSerialHelper = {
    currentData: {},
    startRec: 0,
    msgNum: 0,
    serial: null,
    receivedUpdateCallback: null,
    onReceiveUpdate: function(callback) {
        console.log("SerialHelper mock: onReceiveUpdate");
        setInterval(function() {
            callback({
                group1: {
                    temperature: 99,
                        setting: {
                        temperature: 9,
                            value: 120
                    }
                },
                group2: {
                    temperature: 99,
                        setting: {
                        temperature: 92,
                            value: 120
                    }
                },
                predictGroup: {
                    temperature: 89,
                        setting: {
                        temperature: 85
                    }
                },
                steam: {
                    power: 1337,
                        setting: {
                        power: 1337
                    }
                }
            });
        }, 10000);
        },
    SerialOpen: function() { console.log("SerialHelper mock: SerialOpen"); },
    Received: function(bufUart) { console.log("SerialHelper mock: Received"); },
    Transmit: function() { console.log("SerialHelper mock: Transmit"); }
}

function wrapProxy(obj) {
    let proxy = new Proxy(obj, {
        get(target, prop) {
            if(!mockSerialHelper.hasOwnProperty(prop)) {
                console.error('Mocked serial helper doesn\'t support prop: ' + prop);
                return target[prop];
            } else {
                return mockSerialHelper[prop];
            }
        },
        set(target, prop, value) {
            target[prop] = value;
            return true;
        }
    });
    return proxy;
}

module.exports.patchSerialHelperForDebugging = function patchSerialHelperForDebugging(serialHelper) {
    if(process.arch !== 'arm') {
        console.warn("Serial helper switch to mock-mode. Your arch-type isn't arm.");
        serialHelper = wrapProxy(serialHelper);
    }
    return serialHelper;
}