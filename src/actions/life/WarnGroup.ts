import { IObjectAny, ProcessStatus, ICommandBlock } from "../../types";
import store, { emitStm } from "../../SettingsStore";
import Converter, { StmMessages, StmCommands } from "../../../server/stm/Converter";


const checkToStop = (button: StmMessages.Button2 | StmMessages.Button4, state: IObjectAny) => {
  const machine = store.getState().machine
  if (machine[button] === '1') {
    state.step = '0'
    return false
  }
  return true
}

export const WarnGroup = (
  groupTemp: StmMessages.Group1Temperature | StmMessages.Group2Temperature,
  rele1: StmCommands.SetRelay4 | StmCommands.SetRelay6,
  rele2: StmCommands.SetRelay5 | StmCommands.SetRelay7, // ????
  setTemp: 'Group1Temperature' | 'Group2Temperature',
  trend: 'middleTTrendG1' | 'middleTTrendG2',
  speedWarm: 'speedG1' | 'speedG2'
) => (
  state: IObjectAny,
  commands: ICommandBlock,
  changeStatus: (newStatus: ProcessStatus) => void
): IObjectAny => {
  const machine = store.getState().machine
  const settings = store.getState().settings
  const life = state.getState().life

  if (state.stop) {
    return state;
  }

  const needTemp = parseInt(settings[setTemp], 10) || 0
  if (needTemp < 70) {
    changeStatus(ProcessStatus.done)
    return state
  }

  const trendG = life[trend]
  const temperature = trendG[trendG - 1].value
  const speed = life['speedG1']

  if (temperature < needTemp) {
    changeStatus(ProcessStatus.wip)
    commands[rele1]++
  } else {
    changeStatus(ProcessStatus.done)
  }

  return { ...state };
};
