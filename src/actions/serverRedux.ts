
import { createStore } from "redux";
import rootReducer from "../reducers/index";
import Converter, { ISTMCommand, StmCommands } from "../../server/stm/Converter";
import Usart from "../../server/usart/Usart";

const store = createStore(rootReducer);
let dump:{usart: Usart} = {usart: null}

export const setUsart = (_us: Usart) => {
  dump.usart = _us
}
let a1 = 0
let a2 = 0
export const emitStm = (payload: ISTMCommand) => {
  if (payload.id === StmCommands.ResetVolumetricG1) {
    console.log('VOLUME 1 = ', payload.content, '         - ', a1)
    a1++
  }
  if (payload.id === StmCommands.ResetVolumetricG1) {
    console.log('VOLUME 2 = ', payload.content, '         - ', a2)
    a2++
  }
  dump.usart.sendMessage(Converter.toString(payload))
}


export { store }