import { IObjectAny, ProcessStatus, ICommandBlock } from "../../types";
import store, { emitStm, getLocalState } from "../../SettingsStore";
import Converter, { StmMessages, StmCommands } from "../../../server/stm/Converter";


export const WarmGroup = (
  pressure: StmMessages.Group1Pressure | StmMessages.Group2Pressure,
  rele1: StmCommands.SetRelay4 | StmCommands.SetRelay6,
  rele2: StmCommands.SetRelay5 | StmCommands.SetRelay7, // ????
  setTemp: 'Group1Temperature' | 'Group2Temperature',
  trend: 'middleTTrendG1' | 'middleTTrendG2',
) => (
  state: IObjectAny,
  commands: ICommandBlock,
  changeStatus: (newStatus: ProcessStatus) => void
): IObjectAny => {
  const machine = getLocalState().machine
  const settings = store.getState().settings
  const life = getLocalState().life

  if (state.stop) {
    return state;
  }

  
  const pressureG = parseInt(machine[pressure], 10) || 0;

  const needTemp = parseInt(settings[setTemp], 10) || 0
  if (needTemp < 70 || pressureG < 500) {
    return state
  }

  const trendG = life[trend]
  const temperature = trendG[trendG.length - 1].value
  //const speed = life['speedG1']

  switch (state.step) {
    case '1':
      if (state.power > 0) {
        commands[rele1]++
      }
      const current = Date.now()
      if (current - state.stepStart > state.waitWarmTimeout) {
        state.step = '0'
      }
      break;
    default:
      if (!state.I) {
        state.I = 0;
      }
      if (!state.prevError) {
        state.prevError = 0;
      }
      const e = needTemp - temperature
      const kProp = 0.5;
      const kInt = 0.002;
      const kDiff = 50;
      const P = kProp * e;
      const I = state.I + kInt * e;
      const D = (e - state.prevError) * kDiff;
      state.power = P + I + D;
      state.power *= 1000
      if (state.power < 0) {
        state.waitWarmTimeout = 500
      } else {
        if (e < -0.5) {
          state.power = 0
          state.waitWarmTimeout = 1000
        } else if (e < 0) {
          state.power = state.power / 2
          if (state.power < 1000) {
            state.power = 0
            state.waitWarmTimeout = 500
          } else {        
            state.waitWarmTimeout = state.power > 5000 ? 5000 : state.power 
          }
        } else if (e < 1) {
          state.power = state.power / 2
          if (state.power < 800) {
            state.power = 800
          } 
          state.waitWarmTimeout = state.power > 5000 ? 5000 : state.power 
        } else {
          if (state.power < 1000) {
            state.power = 1000
          } 
          state.waitWarmTimeout = state.power > 5000 ? 5000 : state.power 
        }
             
      }
      state.prevError = e
      state.step = '1'
      state.stepStart = Date.now()
      break;
  }

  return { ...state };
};
