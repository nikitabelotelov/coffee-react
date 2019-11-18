import { IObjectAny, ProcessStatus, ICommandBlock } from "../../types";
import { getLocalState } from "../../SettingsStore";
import { StmMessages } from "../../../server/stm/Converter";


export const SleepMode = (
  state: IObjectAny,
  commands: ICommandBlock,
  changeStatus: (newStatus: ProcessStatus) => void
): IObjectAny => {
  const machine = getLocalState().machine

  if (state.stop) {
    return state;
  }

  switch(state.step) {
    case '1':
      if (machine[StmMessages.Button1] === '2') {
        state.step = '0'
      } else {
        changeStatus(ProcessStatus.wip)
      }
    break;
    default:
      changeStatus(ProcessStatus.done)
      if (machine[StmMessages.Button1] === '1') {
        state.step = '1'
      }
      break
  }
  return { ...state };
};
