import { IObjectAny, ProcessStatus, ICommandBlock } from "../../types";
import store, { emitStm } from "../../SettingsStore";
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
    /*if (machine[StmMessages.Relay8] === "1") {
      emitStm({ id: StmCommands.SetRelay1, content: "0" }, true);
    }*/
    return state;
  }

  const pressure = parseInt(machine[groupPressureFlag], 10) || 0;
  const needTemperature = parseInt(settings[settingsKey]) || 0;
  if (pressure < 100 && needTemperature > 70) {
    changeStatus(ProcessStatus.wip)
    commands[StmCommands.SetRelay8]++
    commands[commandValve]++
  } else {
    changeStatus(ProcessStatus.done)
  }

  return { ...state };
};
