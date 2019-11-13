import { IObjectAny, ProcessStatus, ICommandBlock } from "../../types";
import store, { emitStm, getLocalState } from "../../SettingsStore";
import { StmMessages, StmCommands } from "../../../server/stm/Converter";


const checkToStop = (button: StmMessages.Button3 | StmMessages.Button6, state: IObjectAny) => {
  const machine = getLocalState().machine
  if ((machine[button] === '1' || machine[button] === '2') && machine[button] !== state.buttonState) {
    state.step = '0'
    state.buttonState = machine[button]
    return false
  }
  return true
}

const calcTime = (state: IObjectAny, commands: ICommandBlock, sec: StmCommands.SetSecGroup1 | StmCommands.SetSecGroup2) => {
  const current = Date.now()
  let duration = Math.round((state.startBoil - current) / 1000)
  if (duration < 0) {
    duration = 0
  }
  commands[sec] = duration
}

export const BoilProcessGroup = (
  button: StmMessages.Button3 | StmMessages.Button6,
  valveIn: StmCommands.SetValve2 | StmCommands.SetValve3,
  valveOut: StmCommands.SetValve4 | StmCommands.SetValve5,
  volumeSensor: StmMessages.VolumetricGroup1 | StmMessages.VolumetricGroup2,
  resetVolumetric: StmCommands.ResetVolumetricG1 | StmCommands.ResetVolumetricG2,
  sec: StmCommands.SetSecGroup1 | StmCommands.SetSecGroup2,
  autoMode: 'Group1AutoMode1' | 'Group1AutoMode2' | 'Group2AutoMode1' | 'Group2AutoMode2'
) => (
  state: IObjectAny,
  commands: ICommandBlock,
  changeStatus: (newStatus: ProcessStatus) => void
): IObjectAny => {
  const machine = getLocalState().machine
  const settings = store.getState().settings

  if (state.stop) {
    return state;
  }

  switch(state.step) {
    case '1':
      if (checkToStop(button, state)) {
        changeStatus(ProcessStatus.wip)
        if (machine[volumeSensor] === '1') {
          state.step = '2'
          state.startBoil = Date.now()
        } else {
          commands[resetVolumetric]++
        }
      }
    break;
    case '2':
      // START BEFORE BOIL
      if (checkToStop(button, state)) {
        calcTime(state, commands, sec)
        commands[valveOut]++
        commands[StmCommands.SetRelay8]++
        state.step = '3'
        state.beforePressure = Date.now()
      }
      break;
    case '3':
      if (checkToStop(button, state)) {
        calcTime(state, commands, sec)
        // time before boil. TODO: change 0 to setting
        if (Date.now() - state.beforePressure > 2000) {
          state.step = '4'
          state.silentBeforePressure = Date.now()
        } else {
          commands[valveOut]++
          commands[StmCommands.SetRelay8]++
        }
      }
      break;
    case '4':
      if (checkToStop(button, state)) {
        calcTime(state, commands, sec)
        // time before boil. TODO: change 0 to setting
        if (Date.now() - state.silentBeforePressure > 2000) {
          state.step = '5'
          state.silentBeforePressure = Date.now()
        }
      }
      break;
    case '5':
      if (checkToStop(button, state)) {
        calcTime(state, commands, sec)
        const volumne = parseInt(machine[volumeSensor], 10) || 0
        const needVolume = parseInt(settings[autoMode]) || 100
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
