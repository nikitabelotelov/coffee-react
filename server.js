const path = require('path'),
    express = require('express'),
    fs = require('fs'),
    app = express(),
    resourcesPath = path.join('', 'client/build'),
    SerialHelper = require('./serialHelper').SerialHelper;

EXIT_CODES = {
    OK: 0,
    UPDATE: 1,
    ERROR: 2
};

app.use(express.static(resourcesPath));

const port = 3001;
var expressServer = app.listen(process.env.PORT || port);
console.log('app available on port ' + port);

// websockets

const {createServer} = require('wss')

global.settings = {
    g1TSet: 94,
    g2TSet: 92,
    g1TimeSet: 0,
    g2TimeSet: 0,
    g1AutoMode1: 0,
    g1AutoMode2: 0,
    g2AutoMode1: 0,
    g2AutoMode2: 0,
    allRecieved: 0,
    g1_1TimeSet: 0,
    g2_1TimeSet: 0,
    parTSet: 1000,
    rCold: 0,
    gCold: 0,
    bCold: 16,
    aCold: 16,
    rHot: 16,
    gHot: 0,
    bHot: 0,
    aHot: 16
};

global.currentInfo = {
    group1: {
        temperature: 96,
        setting: {
            temperature: 97,
            value: 120
        }
    },
    group2: {
        temperature: 92,
        setting: {
            temperature: 92,
            value: 120
        }
    },
    predictGroup: {
        temperature: 85,
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
};

var INTERVALS = [];

const wss = createServer(function connectionListener(ws) {
    var initSettingsTmt = setTimeout(() => {
        ws.send(JSON.stringify(getInitialSettings()));
    }, 5000);

    setIntervalWrapper(() => {
        ws.send(JSON.stringify(getCurrentInfo()));
    }, 1000);

    // Send alive-message every 2 seconds
    setIntervalWrapper(function aliveSender() {
        ws.send(JSON.stringify({type: "alive"}));
    }, 2000);
    ws.on('close', () => {
        clearTimeout(initSettingsTmt);
        stopAllIntervals();
    });
    ws.on('message', (data) => {
        handleMessage(JSON.parse(data));
    });

}).listen(3002, function() {
    const {address, port} = this.address() // this is the http[s].Server
    console.log('listening on http://%s:%d (%s)', /::/.test(address) ? '0.0.0.0' : address, port)
});

function handleMessage(data) {
    switch (data.type) {
        case "newSettings":
            global.settings = data.data;
            return sendSettings(data.data);
        default:
            return "wrong request";
    }
}

function getInitialSettings() {
    return {
        type: 'initialSettings',
        data: global.settings
    };
}

function getCurrentInfo() {
    return {
        type: 'currentInfoUpdate',
        data: global.currentInfo
    };
}

app.get('/Update', (req, res) => {
    console.log('Update request!');
    res.end();
    process.exitCode = EXIT_CODES.UPDATE;
    stopServers();
    stopAllIntervals();
});

function setIntervalWrapper(callback, time) {
    INTERVALS.push(setInterval(callback, time));
}

function stopAllIntervals() {
    for (var i = 0; i < INTERVALS.length; i++) {
        clearInterval(INTERVALS[i]);
    }
}

function stopServers() {
    // closeAllClientConnections(wss);
    wss.close();
    expressServer.close();
}

function handleCurrentInfoUpdated(receivedInfo) {
    for (var key in receivedInfo) {
        global.currentInfo[key] = receivedInfo[key];
    }
}

function sendSettings(data) {
    global.SerialHelper.Transmit(data);
}

SerialHelper.SerialOpen();
// global.SerialHelper.onReceiveUpdate(handleCurrentInfoUpdated);