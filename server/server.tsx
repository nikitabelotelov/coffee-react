import path from "path";
import express from "express";
//import template from '../src/template'; use for SSR
import WebSocket from "ws";
import Usart from "./usart/Usart";
import { RSerial } from "./mocha/RSerial";
import { Serial } from 'raspi-serial';
import Converter, { ISTMMessage } from "./stm/Converter";

const app: any = express(),
  resourcesPath = path.join("", ".");

app.use(express.static(resourcesPath));

const port = process.env.PORT || 777;
const expressServer = app.listen({ port }, () =>
  console.log(`🚀 Server ready`)
);

const wss = new WebSocket.Server({ server: expressServer });
const clients: {[propname:string]: {ws: WebSocket}} = {};

let serial;
if(process.arch === 'arm') {
  serial = new Serial();
} else {
  serial = new RSerial();
}

const messagesFromStm:ISTMMessage[] = [];
const settingsMsg:any[] = [];

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

  // TODO:: read file with settings here 
  // settingsMsg.push(here is settings from file)

  ws.on("close", () => {
    delete clients[id];
  });

  ws.on("message", data => {
    // console.log(data);
    // @ts-ignore
    const message = JSON.parse(data)

    if (message.stm) {
      console.log("Got message from client. Trying to send to usart.");
      usart.sendMessage(message.stm)
    } else if (message.settings) {
      //todo: save settings to file
      // read - change - save
    }
  });
});
