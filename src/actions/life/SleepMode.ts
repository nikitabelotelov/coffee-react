import { IObjectAny, ProcessStatus, ICommandBlock } from "../../types";
import { store } from "../serverRedux"
import { StmMessages, StmCommands } from "../../../server/stm/Converter";


export const SleepMode = (
  state: IObjectAny,
  commands: ICommandBlock,
  changeStatus: (newStatus: ProcessStatus) => void
): IObjectAny => {
  const machine = store.getState().machine

  if (state.stop) {
    return state;
  }

  switch(state.step) {
    case '1':
      if (machine[StmMessages.Button1] === '2') {
        state.step = '0'
      } else {
        changeStatus(ProcessStatus.wip)
        commands[StmCommands.SetLightButton1] = 0
      }
    break;
    default:
      changeStatus(ProcessStatus.done)
      commands[StmCommands.SetLightButton1] = 1
      if (machine[StmMessages.Button1] === '1') {
        state.step = '1'
      }
      break
  }
  return { ...state };
};
