import path from "path";
import express from "express";
//import template from '../src/template'; use for SSR
import WebSocket from "ws";
import Usart from "./usart/Usart";
import { RSerial } from "./mocha/RSerial";
import Converter, { ISTMMessage } from "./stm/Converter";
import { loadSettings, serializeSettingsProfiles } from "./fs/fsLib";
import { ISettingsProfilesState } from "../src/types";
import fs from "fs"
import { settings } from "cluster";

let Serial:any;
try {
  Serial = require('raspi-serial').Serial;
} catch(e) {
  console.warn('Couldn\'t load raspi-serial. Will use mock-object instead.');
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

const usart = new Usart(serial as any);

const sendMessages = () => {
  while(messagesFromStm.length) {
    let msg = messagesFromStm.pop();
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
    for (let client in clients) {
      try {
        clients[client].ws.send(JSON.stringify({settingsProfiles: msg}))
      } catch(e) {
        console.error('Couldn\'t send message to websocket. Connection is probably closed. ' + e.message);
      }
    }
  }
}

usart.msgHandlers.push(message => {
  const stm = Converter.fromString(message) as ISTMMessage;
  messagesFromStm.push(stm);
  sendMessages();
});

wss.on("connection", function connectionListener(ws) {
  var id = Math.random();
  clients[id] = {
    ws: ws
  };

  console.log("новое соединение " + id);

  loadSettings().then((result) => {
    settingsProfiles = result;
    settingsMsg.push(settingsProfiles);
    sendMessages();
  });

  ws.on("close", () => {
    delete clients[id];
  });

  ws.on("message", data => {
    // @ts-ignore
    const message: any = JSON.parse(data)

    if (message.stm) {
      //console.log("Got message from client. Trying to send to usart.");
      usart.sendMessage(message.stm)
    } else if (message.settings) {
      settingsProfiles.profiles[message.settings.profile].settings[message.settings.id] = message.settings.content;
      serializeSettingsProfiles(settingsProfiles);
      console.log(data);
      // todo: save settings to file
      // read - change - save
    } else if(message.profile) {
      settingsProfiles.choosenProfile = message.profile;
      serializeSettingsProfiles(settingsProfiles);
      console.log(data);
    } else {
      console.log(data);
    }
  });
});
