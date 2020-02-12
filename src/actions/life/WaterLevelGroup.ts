import { IObjectAny, ProcessStatus, ICommandBlock } from "../../types";
import { store } from "../serverRedux"
import { StmMessages, StmCommands } from "../../../server/stm/Converter";

export const WaterLevelGroup = (
  groupPressureFlag: StmMessages.Group1Pressure | StmMessages.Group2Pressure,
  commandValve: StmCommands.SetValve2 | StmCommands.SetValve3,
  settingsKey: 'Group1Temperature' | 'Group2Temperature'
) => (
  state: IObjectAny,
  commands: ICommandBlock,
  changeStatus: (newStatus: ProcessStatus) => void
): IObjectAny => {
  const machine = store.getState().machine;
  const settings = store.getState().settings

  if (state.stop) {
    return state;
  }

  const pressure = parseInt(machine[groupPressureFlag], 10) || 0;
  const needTemperature = parseInt(settings[settingsKey]) || 0;
  if (needTemperature < 70) {
    changeStatus(ProcessStatus.done)
    return { ...state}
  }

  if (pressure < 100) {
    if (!state.started) {
      state.started = Date.now()
    }
    if (Date.now() - state.started > 1000) {
      state.wasStartedWarm = 1
      changeStatus(ProcessStatus.wip)
      commands[StmCommands.SetRelay8]++
      commands[commandValve]++
    }
  } else if (state.wasStartedWarm && pressure < 400) {
    changeStatus(ProcessStatus.wip)
    commands[StmCommands.SetRelay8]++
    commands[commandValve]++
  } else {
    state.wasStartedWarm = 0
    state.started = 0
    changeStatus(ProcessStatus.done)
  }

  return { ...state };
};
