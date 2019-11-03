import ACTION_TYPES from "../actions/actionTypes";
import { IMachineState, ISettingsState, IBasicMessage, ISettingsProfilesState, ISettingsProfilesMessage } from "../types";
import Converter, { StmMessages, ISTMMessage, ISTMCommand } from "../../server/stm/Converter";

export interface ITempPoint {time: number, value: number}

export interface IAppState {
  machine: IMachineState
  settings: ISettingsState
  life: {
    tTrendG1: ITempPoint[],
    tTrendG2: ITempPoint[],
    middleTTrendG1: ITempPoint[],
    middleTTrendG2: ITempPoint[],
    godMod: number
  }
  update: number,
  settingsProfiles: ISettingsProfilesState | null
}


const initialState: IAppState = {
  update: 0,
  life: {
    tTrendG1: [],
    tTrendG2: [],
    middleTTrendG1: [],
    middleTTrendG2: [],
    godMod: 0,
  },
  machine: {
    [StmMessages.SteamPressure]: "",
    [StmMessages.Group1Pressure]: "",
    [StmMessages.Group1Temperature]: "",
    [StmMessages.Group2Pressure]: "",
    [StmMessages.Group2Temperature]: "",
    [StmMessages.PredictGroupTemperature]: "",
    [StmMessages.Error]: "",
    [StmMessages.Valve1]: "",
    [StmMessages.Valve2]: "",
    [StmMessages.Valve3]: "",
    [StmMessages.Valve4]: "",
    [StmMessages.Valve5]: "",
    [StmMessages.Valve6]: "",
    [StmMessages.Relay1]: "",
    [StmMessages.Relay2]: "",
    [StmMessages.Relay3]: "",
    [StmMessages.Relay4]: "",
    [StmMessages.Relay5]: "",
    [StmMessages.Relay6]: "",
    [StmMessages.Relay7]: "",
    [StmMessages.Relay8]: "",
    [StmMessages.Echo]: "",
    [StmMessages.WaterLevel]: "",
    [StmMessages.Button1]: "0",
    [StmMessages.Button2]: "0",
    [StmMessages.Button3]: "0",
    [StmMessages.Button4]: "0",
    [StmMessages.Button5]: "0",
    [StmMessages.Button6]: "0",
    [StmMessages.Button7]: "0",
    [StmMessages.Button8]: "0",
    [StmMessages.VolumetricGroup1]: "0",
    [StmMessages.VolumetricGroup2]: "0",
    
  },
  settings: { //TODO:: load from file here
    Group1Temperature: '0',
    Group1AutoMode1: '0',
    Group1AutoMode2: '0',
    Group2Temperature: '0',
    Group2AutoMode1: '0',
    Group2AutoMode2: '0',
    SteamPressure: '0',
    RedCold: '0',
    GreenCold: '0',
    BlueCold: '16',
    RedHot: '16',
    GreenHot: '0',
    BlueHot: '0',
    EnergyMode: '0',
  },
  settingsProfiles: null
}

function getChanges(source: ITempPoint[]): number[] {
  let changes: number[] = []
  for (let i=1; i< source.length; i++) {
    const current = source[i].value
    const prev = source[i-1].value
    changes.push(current > prev ? current / prev : prev / current)
  }
  return changes
}


function CreateMiddleTrend(source: ITempPoint[]): ITempPoint[] {
  const result:ITempPoint[] = []
  let changes: number[] = getChanges(source)
  let middleOfChanges = 0
  for (let i=0; i< changes.length; i++) {
    middleOfChanges += changes[i]
  }
  middleOfChanges /= changes.length

  const smooth = [ ...source]
  // find impuls
  for (let i=1; i< smooth.length-1; i++) {
    const current = smooth[i].value
    const prev = smooth[i-1].value
    const next = smooth[i+1].value

    if (current < prev && current < next || current > next && current > prev) {
      if (changes[i] > middleOfChanges) {
        smooth[i] = {time: smooth[i].time, value: (prev + next) / 2}
        changes = getChanges(smooth)
      }
    }
  }

  for (let i=1; i< smooth.length-1; i++) {
    const current = smooth[i]
    const prev = smooth[i-1].value
    const next = smooth[i+1].value
    result.push({value: (current.value + prev + next) / 3, time: current.time})
  }
  return result
}

const getLastTrend = (source: ITempPoint[]): {time: number, value: number} => {
  const last = source[source.length - 1]
  return last
}

function rootReducer(state: IAppState = initialState, action: {type: ACTION_TYPES, payload: ISTMMessage | IBasicMessage | ISTMCommand | ISettingsProfilesMessage | null}) {
  switch (action.type) {
    case ACTION_TYPES.setSetting:
      state.settings[(action.payload as IBasicMessage).id] = (action.payload as IBasicMessage).content;
      return { ...state, settings: {...state.settings} };
    case ACTION_TYPES.currentInfoUpdate:
      state.machine[(action.payload as ISTMMessage).id] = (action.payload as ISTMMessage).content;

      if ((action.payload as ISTMMessage).id === StmMessages.Group1Temperature) {
        const temp = Converter.voltToCelsium((action.payload as ISTMMessage).content)
        state.life.tTrendG1.push({
          time: Date.now(),
          value: temp
        })
        state.life.tTrendG1 = [...state.life.tTrendG1]
        if (state.life.tTrendG1.length > 100) {
          state.life.tTrendG1.splice(0, 1)
          state.life.middleTTrendG1 = CreateMiddleTrend(state.life.tTrendG1)
        }
      }

      return { ...state, machine: {...state.machine}, life: {...state.life} };
    case ACTION_TYPES.settingsProfilesInitialize:
        return { ...state, machine: {...state.machine}, life: {...state.life}, settingsProfiles: (action.payload as ISettingsProfilesMessage).settingsProfiles };
  }
  return state;
}

export default rootReducer;
