import { createStore } from "redux";
import rootReducer from "../reducers/index";
import { WebSocketController } from "../actions/WebSocketController";
import Converter, { ISTMCommand, ISTMMessage, StmMessages } from "../../server/stm/Converter";
import ACTION_TYPES from "../actions/actionTypes";
import { IBasicMessage } from "../types";
import { Life } from "../actions/machineLife";
import reducer from "../reducers/index";

const store = createStore(rootReducer);

let localState = store.getState()
let needDump = false
const WebSocketInst = new WebSocketController()
WebSocketInst.registerCallback((data: any) => {
  const parsed = JSON.parse(data)
  if (parsed.stm) {
    const msg = Converter.fromString(parsed.stm) as ISTMMessage;
    localState = reducer(localState, {
      type: ACTION_TYPES.currentInfoUpdate,
      payload: msg
    })
    needDump = true
  } 
  if (parsed.settings) {
    // set settings to client store
  }
})

setInterval(() => {
  if (needDump) {
    needDump = false;
    store.dispatch({type: ACTION_TYPES.setMachineState, payload: localState});
  }
}, 100)

export const emit = (payload: IBasicMessage) => {
  WebSocketInst.send(JSON.stringify({ settings: payload }));
}

export const emitStm = (payload: ISTMCommand, waitEcho?: boolean) => {
  //console.log("Message emitted " + JSON.stringify(payload));
  WebSocketInst.send(JSON.stringify({ stm: Converter.toString(payload) }));
  if (waitEcho) {
    
    const echoWaiter = (data: any) => {
      const parsed = JSON.parse(data)
      const msg = Converter.fromString(parsed.stm) as ISTMMessage;
      if (msg.id === StmMessages.Echo) {
        const converted = Converter.fromString(msg.content)
        // console.log('ECHO:', converted)
        if (payload.id === converted.id && payload.content === converted.content) {
          clearTimeout(echoTimeout)
        } else {
          emitStm(payload, true)
        }
        WebSocketInst.unRegisterCallback(echoWaiter)
      } 
    }
    const echoTimeout = setTimeout(() => {
      emitStm(payload, true)
      WebSocketInst.unRegisterCallback(echoWaiter)
    }, 1000)
    WebSocketInst.registerCallback(echoWaiter)
  }
}

setTimeout(()=>{
  setInterval(()=>{
    Life.step()
  }, 50)
}, 5000)


export default store;