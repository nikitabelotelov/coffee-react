
import { createStore } from "redux";
import rootReducer from "../reducers/index";
import Converter, { ISTMCommand, StmCommands } from "../../server/stm/Converter";
import Usart from "../../server/usart/Usart";

const store = createStore(rootReducer);
let dump:{usart: Usart} = {usart: null}

export const setUsart = (_us: Usart) => {
  dump.usart = _us
}
export const emitStm = (payload: ISTMCommand) => {
  dump.usart.sendMessage(Converter.toString(payload))
}


export { store }