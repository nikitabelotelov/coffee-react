import { IObjectAny, ProcessStatus, ICommandBlock } from "../../types";
import store, { emitStm } from "../../SettingsStore";
import { StmMessages, StmCommands } from "../../../server/stm/Converter";


const checkToStop = (button: StmMessages.Button2 | StmMessages.Button4, state: IObjectAny) => {
  const machine = store.getState().machine
  if (machine[button] === '1') {
    state.step = '0'
    return false
  }
  return true
}

export const BoilProcessGroup = (
  button: StmMessages.Button2 | StmMessages.Button4,
  valveIn: StmCommands.SetValve2 | StmCommands.SetValve3,
  valveOut: StmCommands.SetValve4 | StmCommands.SetValve5,
  volumeSensor: StmMessages.VolumetricGroup1 | StmMessages.VolumetricGroup2,
  autoMode: 'Group1AutoMode1' | 'Group1AutoMode2' | 'Group2AutoMode1' | 'Group2AutoMode2'
) => (
  state: IObjectAny,
  commands: ICommandBlock,
  changeStatus: (newStatus: ProcessStatus) => void
): IObjectAny => {
  const machine = store.getState().machine
  const settings = store.getState().settings

  if (state.stop) {
    /*if (machine[StmMessages.Relay8] === "1") {
      emitStm({ id: StmCommands.SetRelay1, content: "0" }, true);
    }*/
    return state;
  }

  switch(state.step) {
    case '1':
      changeStatus(ProcessStatus.wip)
      if (machine[button] === '0') {
        state.step = '2'
      }
    break;
    case '2':
      if (checkToStop(button, state)) {
        //TODO: add reset variom status

        commands[valveIn]++
        commands[valveOut]++
        state.step = '3'
        state.beforePressure = Date.now()
      }
      break;
    case '3':
      if (checkToStop(button, state)) {
        // time before boil. TODO: change 0 to setting
        if (Date.now() - state.beforePressure > 0) {
          state.step = '4'
          state.silentBeforePressure = Date.now()
        } else {
          commands[valveIn]++
          commands[valveOut]++
        }
      }
      break;
    case '4':
      if (checkToStop(button, state)) {
        // time before boil. TODO: change 0 to setting
        if (Date.now() - state.silentBeforePressure > 0) {
          state.step = '5'
          state.silentBeforePressure = Date.now()
        }
      }
      break;
    case '5':
      if (checkToStop(button, state)) {
        const volumne = parseInt(machine[volumeSensor], 10) || 0
        const needVolume = parseInt(settings[autoMode]) || 0
        if (volumne < needVolume) {
          commands[valveIn]++
          commands[valveOut]++
          commands[StmCommands.SetRelay8]++
        } else {
          state.step = '0'
        }
      }
      break;
    default:
      changeStatus(ProcessStatus.done)
      if (machine[button] === '1') {
        state.step = '1'
      }
      break
  }
  return { ...state };
};
