import { IObjectAny, ProcessStatus, ICommandBlock } from "../../types";
import store, { emitStm, getLocalState } from "../../SettingsStore";
import Converter, { StmMessages, StmCommands } from "../../../server/stm/Converter";


export const WarmPredict = (
  state: IObjectAny,
  commands: ICommandBlock,
  changeStatus: (newStatus: ProcessStatus) => void
): IObjectAny => {
  const machine = getLocalState().machine
  const settings = store.getState().settings

  if (state.stop) {
    return state;
  }

  const needTempG1 = parseInt(settings.Group1Temperature, 10) || 0
  const needTempG2 = parseInt(settings.Group2Temperature, 10) || 0
  const pressureG1 = parseInt(machine[StmMessages.Group1Pressure], 10) || 0;
  const pressureG2 = parseInt(machine[StmMessages.Group2Pressure], 10) || 0;

  if (needTempG1 < 70 && needTempG2 < 70 || pressureG1 < 500 || pressureG2 < 500) {
    return state
  }


  const temperature = parseInt(machine[StmMessages.PredictGroupTemperature], 10)
  if (temperature < 75) {
    state.started = 1
    changeStatus(ProcessStatus.wip)
    commands[StmCommands.SetRelay1]++
  } else if (state.started) {
    commands[StmCommands.SetRelay1]++
  } else if (temperature > 85) {
    state.started = 0
    changeStatus(ProcessStatus.done)
  }


  return { ...state };
};
