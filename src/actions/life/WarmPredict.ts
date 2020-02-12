import { IObjectAny, ProcessStatus, ICommandBlock } from "../../types";
import { store } from "../serverRedux"
import Converter, { StmMessages, StmCommands } from "../../../server/stm/Converter";


export const WarmPredict = (
  state: IObjectAny,
  commands: ICommandBlock,
  changeStatus: (newStatus: ProcessStatus) => void
): IObjectAny => {
  const machine = store.getState().machine
  const settings = store.getState().settings

  if (state.stop) {
    return state;
  }

  const needTempG1 = parseInt(settings.Group1Temperature, 10) || 0
  const needTempG2 = parseInt(settings.Group2Temperature, 10) || 0
  const pressureG1 = parseInt(machine[StmMessages.Group1Pressure], 10) || 0;
  const pressureG2 = parseInt(machine[StmMessages.Group2Pressure], 10) || 0;

  if (needTempG1 < 70 && needTempG2 < 70 || pressureG1 < 100 || pressureG2 < 100) {
    return state
  }


  const temperature = parseInt(machine[StmMessages.PredictGroupTemperature], 10)
  const needPr = parseInt(settings.PredictTemperature, 10) || 10
  if (temperature < needPr - 3) {
    state.started = 1
    changeStatus(ProcessStatus.wip)
    commands[StmCommands.SetRelay3]++
  } else if (state.started) {
    commands[StmCommands.SetRelay3]++
  } else if (temperature > needPr + 3) {
    state.started = 0
    changeStatus(ProcessStatus.done)
  }


  return { ...state };
};
