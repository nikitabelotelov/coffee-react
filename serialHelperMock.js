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
                currentParP: 1000,
                currentGroup1P: 95,
                currentGroup2P: 97

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