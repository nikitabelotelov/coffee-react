import { IObjectAny, ProcessStatus, ICommandBlock } from "../../types";
import { store } from "../serverRedux"
import { StmMessages, StmCommands } from "../../../server/stm/Converter";


export const HotWater = (
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
      if (machine[StmMessages.Button8] === '2') {
        state.step = '0'
      } else {
        changeStatus(ProcessStatus.wip)
        commands[StmCommands.SetValve6]++
        if (state.wipTime % 1000 < 500) {
          commands[StmCommands.SetLightButton8] = 0
        } else {
          commands[StmCommands.SetLightButton8] = 1
        }
      }
    break;
    default:
      changeStatus(ProcessStatus.done)
      commands[StmCommands.SetLightButton8] = 1
      if (machine[StmMessages.Button8] === '1') {
        state.step = '1'
      }
      break
  }
  return { ...state };
};
