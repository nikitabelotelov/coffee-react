import { IObjectAny, ProcessStatus, ICommandBlock } from "../../types";
import { store } from "../serverRedux"
import { StmMessages, StmCommands } from "../../../server/stm/Converter";


const checkToStop = (button: StmMessages.Button9, state: IObjectAny) => {
  const machine = store.getState().machine
  if ((machine[button] === '1' || machine[button] === '2') && machine[button] !== state.buttonState) {
    state.step = '0'
    state.buttonState = machine[button]
    return false
  }
  return true
}

export const CleanMode = (
  button: StmMessages.Button9
) => (
  state: IObjectAny,
  commands: ICommandBlock,
  changeStatus: (newStatus: ProcessStatus) => void
): IObjectAny => {
  const machine = store.getState().machine
  const settings = store.getState().settings

  if (state.stop) {
    return state;
  }

  if (machine[StmMessages.Button1] === '1') {
    state.step = '0'
    state.buttonState = machine[button]
    commands[StmCommands.SetLightButton9] = 0
    changeStatus(ProcessStatus.done)
    return { ...state }
  }

  const g1Temp = parseInt(settings.Group1Temperature, 10) || 0
  const g2Temp = parseInt(settings.Group2Temperature, 10) || 0

  switch(state.step) {
    case '1':
      if (checkToStop(button, state)) {
        changeStatus(ProcessStatus.wip)
        state.step = '2'
        state.cleanStart1 = Date.now()
      }
    break;
    case '2':
      if (checkToStop(button, state)) {
        if (Date.now() - state.cleanStart1 < 500) {
          commands[StmCommands.SetLightButton9] = 0
        } else if (Date.now() - state.cleanStart1 < 1000) {
          commands[StmCommands.SetLightButton9] = 1
        } else if (Date.now() - state.cleanStart1 < 1500) {
          commands[StmCommands.SetLightButton9] = 0
        } else if (Date.now() - state.cleanStart1 < 2000) {
          commands[StmCommands.SetLightButton9] = 1
        } else if (Date.now() - state.cleanStart1 < 2500) {
          commands[StmCommands.SetLightButton9] = 0
        } else if (Date.now() - state.cleanStart1 < 3000) {
          commands[StmCommands.SetLightButton9] = 1
        }
        if (Date.now() - state.cleanStart1 < 3000) {
          if (g1Temp > 70) {
            commands[StmCommands.SetValve2]++
            commands[StmCommands.SetValve4]++
          }
          if (g2Temp > 70) {
            commands[StmCommands.SetValve3]++
            commands[StmCommands.SetValve5]++
          }
          commands[StmCommands.SetRelay8]++
        } else {
          state.step = '3'
          state.cleanStart1 = Date.now()
        }
      }
      break;
    case '3':
      if (checkToStop(button, state)) {
        if (Date.now() - state.cleanStart1 < 500) {
          commands[StmCommands.SetLightButton9] = 0
        } else if (Date.now() - state.cleanStart1 < 1000) {
          commands[StmCommands.SetLightButton9] = 1
        } else if (Date.now() - state.cleanStart1 < 1500) {
          commands[StmCommands.SetLightButton9] = 0
        } else if (Date.now() - state.cleanStart1 < 2000) {
          commands[StmCommands.SetLightButton9] = 1
        } else if (Date.now() - state.cleanStart1 < 2500) {
          commands[StmCommands.SetLightButton9] = 0
        } else if (Date.now() - state.cleanStart1 < 3000) {
          commands[StmCommands.SetLightButton9] = 1
        }
        if (Date.now() - state.cleanStart1 > 3000) {
          state.step = '4'
          state.cleanStart1 = Date.now()
        }
      }
      break;
    case '4':
      if (checkToStop(button, state)) {
        if (Date.now() - state.cleanStart1 < 500) {
          commands[StmCommands.SetLightButton9] = 0
        } else if (Date.now() - state.cleanStart1 < 1000) {
          commands[StmCommands.SetLightButton9] = 1
        } else if (Date.now() - state.cleanStart1 < 1500) {
          commands[StmCommands.SetLightButton9] = 0
        } else if (Date.now() - state.cleanStart1 < 2000) {
          commands[StmCommands.SetLightButton9] = 1
        } else if (Date.now() - state.cleanStart1 < 2500) {
          commands[StmCommands.SetLightButton9] = 0
        } else if (Date.now() - state.cleanStart1 < 3000) {
          commands[StmCommands.SetLightButton9] = 1
        }
        if (Date.now() - state.cleanStart1 < 3000) {
          if (g1Temp > 70) {
            commands[StmCommands.SetValve2]++
            commands[StmCommands.SetValve4]++
          }
          if (g2Temp > 70) {
            commands[StmCommands.SetValve3]++
            commands[StmCommands.SetValve5]++
          }
          commands[StmCommands.SetRelay8]++
        } else {
          state.step = '5'
          state.cleanStart1 = Date.now()
        }
      }
      break;
    case '5':
      if (checkToStop(button, state)) {
        if (Date.now() - state.cleanStart1 < 500) {
          commands[StmCommands.SetLightButton9] = 0
        } else if (Date.now() - state.cleanStart1 < 1000) {
          commands[StmCommands.SetLightButton9] = 1
        } else if (Date.now() - state.cleanStart1 < 1500) {
          commands[StmCommands.SetLightButton9] = 0
        } else if (Date.now() - state.cleanStart1 < 2000) {
          commands[StmCommands.SetLightButton9] = 1
        } else if (Date.now() - state.cleanStart1 < 2500) {
          commands[StmCommands.SetLightButton9] = 0
        } else if (Date.now() - state.cleanStart1 < 3000) {
          commands[StmCommands.SetLightButton9] = 1
        }
        if (Date.now() - state.cleanStart1 > 3000) {
          state.step = '0'
          state.cleanStart1 = Date.now()
        }
      }
      break;
    default:
      changeStatus(ProcessStatus.done)
      commands[StmCommands.SetLightButton1] = 1
      if (machine[button] === '1' ||  machine[button] === '2') {
        if (state.buttonState === '1' || state.buttonState === '2') {
          if (machine[button] !== state.buttonState) {
            state.step = '1'
            state.buttonState = machine[button]
          }
        } else {
          state.buttonState = machine[button]
        }
      }
      break
  }
  return { ...state };
};
