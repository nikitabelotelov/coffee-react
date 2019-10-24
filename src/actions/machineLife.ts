import store, { emitStm } from "../SettingsStore"
import Converter, { StmMessages, StmCommands } from "../../server/stm/Converter"
import Message from "../../server/usart/Message"
import ACTION_TYPES from "./actionTypes"

export const step = () => {
  const machine = store.getState().machine
  const settings = store.getState().settings
  const echo = store.getState().echo

  if (echo.waiting) {
    const currentTime = Date.now()
    if (currentTime - echo.start > 2000) {
      console.log('TIMEOUT ERROR')
      store.dispatch({
        type: ACTION_TYPES.setEcho,
        payload: null
      })
      // set command as failed
      return
    }
    if (machine[StmMessages.Echo]) {
      const converted = Converter.fromString(machine[StmMessages.Echo])
      console.log('ECHO:', converted)
      
      if (echo.waiting.id === converted.id && echo.waiting.content === converted.content) {
        // set command as success
      } else {
        // set command as failed
      }
      store.dispatch({
        type: ACTION_TYPES.currentInfoUpdate,
        payload: {
          id: StmMessages.Echo,
          content: ''
        }
      })
      store.dispatch({
        type: ACTION_TYPES.setEcho,
        payload: null
      })
      return
    }

    return
  }

  switch (machine[StmMessages.WaterLevel]) {
    case "1":
      //know level and we have enough water
      if (machine[StmMessages.Relay1] === '1') {
        console.log('RELE OFF')
        emitStm({id: StmCommands.SetRelay1, content: "0"})
      }
      break
    case "0":
      // we don't know or we don't have water
      emitStm({id: StmCommands.SetRelay1, content: "1"})
      break
  }
}