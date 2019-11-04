import path from "path";
import express from "express";
//import template from '../src/template'; use for SSR
import WebSocket from "ws";
import Usart from "./usart/Usart";
import { RSerial } from "./mocha/RSerial";
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

const serial = new RSerial();

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
        console.error(e);
      }
    }
  }
  while(settingsMsg.length) {
    let msg = settingsMsg.pop();
    for (let client in clients) {
      try {
        clients[client].ws.send(JSON.stringify({settingsProfiles: msg}))
      } catch(e) {
        console.error(e);
      }
    }
  }
}

usart.msgHandlers.push(message => {
  const stm = Converter.fromString(message) as ISTMMessage;
  messagesFromStm.push(stm)
  sendMessages()
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
      usart.sendMessage(message.stm)
    } else if (message.settings) {
      //todo: save settings to file
      // read - change - save
    }
  });
});
