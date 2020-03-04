import path from "path";
import express from "express";
//import template from '../src/template'; use for SSR
import WebSocket from "ws";
import Usart from "./usart/Usart";
import { RSerial } from "./mocha/RSerial";
import Converter, { ISTMMessage, StmMessages } from "./stm/Converter";
import { loadSettings, serializeSettingsProfiles } from "./fs/fsLib";
import { ISettingsProfilesState, IWifiNetListMessage, IWifiStatus, IWifiNet, WIFI_STATUS } from "../src/types";
import fs from "fs"
import { settings } from "cluster";
import { WifiManager } from "./wifi/Wifi";
import { Wifi } from "../src/ManagerPanel/Wifi";
import { logger } from "../src/logger";
import { Life } from "../src/actions/machineLife";
import ACTION_TYPES from "../src/actions/actionTypes";
import { store, setUsart } from "../src/actions/serverRedux";

let Serial:any;
try {
  Serial = require('raspi-serial').Serial;
} catch(e) {
  logger.warn('Couldn\'t load raspi-serial. Will use mock-object instead. Error: ' + e.message);
  Serial = RSerial;
}

const app: any = express(),
  resourcesPath = path.join("", ".");

let settingsProfiles: ISettingsProfilesState;
const root = process.cwd()
app.use(express.static(resourcesPath));
const indexFile = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
app.use('/*', (req:any, res:any) => {
  res.send(indexFile);
})

function getCurrentProfileIndex() {
  return settingsProfiles.profiles.findIndex((profile) => profile.title === settingsProfiles.choosenProfile)
}

const port = process.env.PORT || 777;

const expressServer = app.listen({ port }, () =>
    console.log(`🚀 Server ready`)
);

const wss = new WebSocket.Server({ server: expressServer });
const clients: {[propname:string]: {ws: WebSocket}} = {};

let serial;
if(process.arch === 'arm') {
  serial = new Serial({baudRate: 57600});
} else {
  serial = new RSerial();
}

const messagesFromStm:ISTMMessage[] = [];
const settingsMsg:ISettingsProfilesState[] = [];
const wifiMessages:Array<IWifiNetListMessage | IWifiStatus> = [];

const usart = new Usart(serial as any);

const sendMessages = () => {

  while(messagesFromStm.length) {
    let msg = messagesFromStm.pop();
    if (msg && msg.content !== undefined) {
      store.dispatch({
        type: ACTION_TYPES.currentInfoUpdate,
        payload: msg
      })
    }
    for (let client in clients) {
      try {
        clients[client].ws.send(JSON.stringify({stm: Converter.toString(msg)}))
      } catch(e) {
        console.error('Couldn\'t send message to websocket. Connection is probably closed. ' + e.message);
      }
    }
  }
  while(settingsMsg.length) {
    let msg = settingsMsg.pop();
    store.dispatch({
      type: ACTION_TYPES.settingsProfilesInitialize,
      payload: {settingsProfiles: msg}
    });
    for (let client in clients) {
      try {
        clients[client].ws.send(JSON.stringify({settingsProfiles: msg}))
      } catch(e) {
        console.error('Couldn\'t send message to websocket. Connection is probably closed. ' + e.message);
      }
    }
  }
  while(wifiMessages.length) {
    let msg = wifiMessages.pop();
    for (let client in clients) {
      try {
        if((msg as IWifiNetListMessage).list) {
          store.dispatch({
            type: ACTION_TYPES.wifiListUpdate,
            payload: msg as IWifiNetListMessage
          })
        } else if((msg as IWifiStatus).wifiStatus) {
          store.dispatch({
            type: ACTION_TYPES.wifiStatusUpdate,
            payload: msg as IWifiStatus
          })
        }
        clients[client].ws.send(JSON.stringify({wifi: msg}))
      } catch(e) {
        console.error('Couldn\'t send message to websocket. Connection is probably closed. ' + e.message);
      }
    }
  }
}

let temp123 = 0
usart.msgHandlers.push(message => {
  const stm = Converter.fromString(message) as ISTMMessage;
  if (stm.id === StmMessages.Button3) {
    console.log('B3 = ', stm.content, '       : ', temp123)
    temp123++
  }
  messagesFromStm.push(stm);
  sendMessages();
});

setUsart(usart)


wss.on("connection", function connectionListener(ws) {
  var id = Math.random();
  clients[id] = {
    ws: ws
  };

  console.log("новое соединение " + id);

  loadSettings().then((result) => {
    settingsProfiles = result
    settingsMsg.push(settingsProfiles)
    sendMessages()
  });

  WifiManager.getAvailableNetworks().then((networks: Array<IWifiNet>) => {
    WifiManager.status().then((status) => {
      wifiMessages.push(status || {wifiStatus: WIFI_STATUS.NOT_CONNECTED, message: "Проблемы с сетью. Обратитесь к Саньку. "})
      wifiMessages.push({ list: networks })
      sendMessages()
    });
  })

  ws.on("close", () => {
    delete clients[id];
  });

  ws.on("message", data => {
    // @ts-ignore
    console.log(data)
    // @ts-ignore
    const message: any = JSON.parse(data)

    if (message.stm) {
      usart.sendMessage(message.stm)
    } else if (message.update) {
      logger.log("Update requested!")
      if(typeof process.send === 'function') {
        process.send("update")
      } else {
        logger.error("Couldn't update in this environment. Please start process via coffee-service")
      }
    } else if (message.settings) {
      settingsProfiles.profiles[getCurrentProfileIndex()].settings[message.settings.id] = message.settings.content;
      serializeSettingsProfiles(settingsProfiles);
      store.dispatch({
        type: ACTION_TYPES.settingsProfilesInitialize,
        payload: {settingsProfiles: settingsProfiles}
      });
    } else if(message.profile) {
      settingsProfiles.choosenProfile = message.profile
      serializeSettingsProfiles(settingsProfiles)
      store.dispatch({
        type: ACTION_TYPES.settingsProfilesInitialize,
        payload: {settingsProfiles: settingsProfiles}
      });
    } else if(message.wifi) {
      logger.log(JSON.stringify(message.wifi));
      wifiMessages.push({
        wifiStatus: WIFI_STATUS.CONNECTING,
        currentWifiNet: { ssid: message.wifi.ssid }
      });
      sendMessages()
      WifiManager.connectWifi(message.wifi.ssid, message.wifi.password).then((res) => {
        logger.log("Wifi connected");
        wifiMessages.push({
          wifiStatus: WIFI_STATUS.CONNECTED,
          currentWifiNet: { ssid: message.wifi.ssid }
        })
        sendMessages()
      }, (res) => {
        wifiMessages.push({
          wifiStatus: WIFI_STATUS.NOT_CONNECTED,
          currentWifiNet: { ssid: message.wifi.ssid }
        })
        sendMessages()
      })
    } else if(message.wifiListUpdate) {
      WifiManager.getAvailableNetworks().then((networks: Array<IWifiNet>) => {
        WifiManager.status().then((status) => {
          wifiMessages.push(status || {wifiStatus: WIFI_STATUS.NOT_CONNECTED, message: "Проблемы с сетью. Обратитесь к Саньку. "})
          wifiMessages.push({ list: networks })
          sendMessages()
        });
      })
    } else {
      logger.log(data);
    } 
  });
});


setTimeout(()=>{
  setInterval(()=>{
    Life.step()
  }, 50)
}, 5000)
