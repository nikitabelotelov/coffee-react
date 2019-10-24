import { createStore } from "redux";
import rootReducer from "../reducers/index";
import { WebSocketController } from "../actions/WebSocketController";
import Converter, { ISTMCommand, ISTMMessage } from "../../server/stm/Converter";
import ACTION_TYPES from "../actions/actionTypes";
import { IBasicMessage } from "../types";
import { step } from "../actions/machineLife";
const store = createStore(rootReducer);

const WebSocketInst = new WebSocketController()
WebSocketInst.registerCallback((data: any) => {
  const parsed = JSON.parse(data)
  const msg = Converter.fromString(parsed.stm) as ISTMMessage;
  store.dispatch({
    type: ACTION_TYPES.currentInfoUpdate,
    payload: msg
  });
})

export const emit = (payload: IBasicMessage) => {
  WebSocketInst.send(JSON.stringify({ settings: payload }));
}

export const emitStm = (payload: ISTMCommand) => {
  store.dispatch({
    type: ACTION_TYPES.setEcho,
    payload: payload
  })

  console.log('COMMAND:', payload)
  WebSocketInst.send(JSON.stringify({ stm: Converter.toString(payload) }));
}

setInterval(()=>{
  step()
}, 100)


export default store;