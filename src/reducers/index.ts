import ACTION_TYPES from "../actions/actionTypes";
import { IMachineState, ISettingsState, IBasicMessage, ISettingsProfilesState, ISettingsProfilesMessage, ISettingsChangeMessage, ISettingsProfile, IWifiNet, IWifiAuthData, WIFI_STATUS, IWifiNetListMessage, IWifiStatus } from "../types";
import Converter, { StmMessages, ISTMMessage, ISTMCommand } from "../../server/stm/Converter";
import { Validate } from "./validate";

export interface ITempPoint { time: number, value: number }

export interface IAppState {
  machine: IMachineState
  life: {
    tTrendG1: ITempPoint[],
    tTrendG2: ITempPoint[],
    middleTTrendG1: ITempPoint[],
    middleTTrendG2: ITempPoint[],
    speedG1: number,
    speedG2: number,
    godMod: number
  }
  update: number,
  settings: ISettingsState,
  choosenProfile: string,
  profiles: Array<ISettingsProfile>,
  availableWifiNets: Array<IWifiNet>,
  wifiStatus: IWifiStatus
}

const initialStandartProfile: ISettingsProfile = {
  title: "Стандарт",
  settings: {
    Group1Temperature: '0',
    Group1AutoMode1: '0',
    Group1AutoMode2: '0',
    Group1Presoaking: '0',
    Group1PostPresoaking: '0',
    Group2Temperature: '0',
    Group2AutoMode1: '0',
    Group2AutoMode2: '0',
    Group2Presoaking: '0',
    Group2PostPresoaking: '0',
    PredictTemperature: '0',
    SteamPressure: '0',
    RedCold: '0',
    GreenCold: '0',
    BlueCold: '0',
    AlphaCold: '15',
    RedHot: '0',
    GreenHot: '0',
    BlueHot: '0',
    AlphaHot: '15',
    EnergyMode: '0',
  }
}
const initialStandartProfileName = "Стандарт"

const initialState: IAppState = {
  update: 0,
  life: {
    tTrendG1: [],
    tTrendG2: [],
    middleTTrendG1: [],
    middleTTrendG2: [],
    speedG1: 0,
    speedG2: 0,
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
    [StmMessages.Button1]: "",
    [StmMessages.Button2]: "",
    [StmMessages.Button3]: "",
    [StmMessages.Button4]: "",
    [StmMessages.Button5]: "",
    [StmMessages.Button6]: "",
    [StmMessages.Button7]: "",
    [StmMessages.Button8]: "",
    [StmMessages.Button9]: "",

    [StmMessages.VolumetricGroup1]: "0",
    [StmMessages.VolumetricGroup2]: "0",

  },
  settings: initialStandartProfile.settings,
  choosenProfile: initialStandartProfileName,
  profiles: [initialStandartProfile],
  availableWifiNets: [],
  wifiStatus: {
    wifiStatus: WIFI_STATUS.NOT_CONNECTED
  }
}

function getChanges(source: ITempPoint[]): number[] {
  let changes: number[] = []
  for (let i = 1; i < source.length; i++) {
    const current = source[i].value
    const prev = source[i - 1].value
    changes.push(current > prev ? current / prev : prev / current)
  }
  return changes
}


function CreateMiddleTrend(source: ITempPoint[]): ITempPoint[] {
  const result: ITempPoint[] = []
  const average = source.reduce((res, el) => { return res + el.value } , 0) / source.length

  for (let i = 0; i < source.length - 1; i++) {
    const current = source[i]
    if(Math.abs(current.value - average) > 10) {
      if(i === 0) {
        result.push({ value: average, time: current.time })  
      } else {
        result.push({ value: source[i - 1].value, time: current.time })
      }
    }
  }
  return result
}

const getSpeed = (source: ITempPoint[]): number => {
  const last = source[source.length - 1]
  let min = source[0]
  let max = source[0]
  source.forEach(el => {
    if (el.value < min.value) {
      min = el
    }
    if (el.value > max.value) {
      max = el
    }
  })

  let speed = 0

  if (min.time > max.time) {
    speed = (last.value - min.value) / (last.time - min.time)
  } else {
    speed = (last.value - max.value) / (last.time - max.time)
  }

  return speed
}

function getCurrentProfileIndex(state: IAppState): number {
  let currentSettings: ISettingsState;
  for (let i = 0; i < state.profiles.length; i++) {
    if (state.profiles[i].title === state.choosenProfile) {
      return i;
    }
  }
}

function rootReducer(state: IAppState = initialState, action: {
  type: ACTION_TYPES, payload: ISTMMessage |
  IBasicMessage |
  ISTMCommand |
  IMachineState |
  ISettingsProfilesMessage |
  IWifiAuthData |
  IWifiNetListMessage |
  IWifiStatus |
  IAppState |
  string |
  null
}) {
  try {
    let currentProfileIndex = getCurrentProfileIndex(state)
    switch (action.type) {
      case ACTION_TYPES.setSetting:
        let currentProfile = state.profiles[currentProfileIndex]
        currentProfile.settings[(action.payload as IBasicMessage).id] = (action.payload as IBasicMessage).content;
        return { ...state, settings: { ...currentProfile.settings } };
      case ACTION_TYPES.setMachineState:
        // @ts-ignore
        return {
          ...state,
          machine: { ...(action.payload as IAppState).machine },
          life: { ...(action.payload as IAppState).life }
        }
      case ACTION_TYPES.currentInfoUpdate:
        if (!Validate((action.payload as ISTMMessage).id, (action.payload as ISTMMessage).content)) {
          return state
        }
        state.machine[(action.payload as ISTMMessage).id] = (action.payload as ISTMMessage).content;
        if ((action.payload as ISTMMessage).id === StmMessages.PredictGroupTemperature) {
          state.machine[(action.payload as ISTMMessage).id] = `${Math.round(Converter.voltToCelsium((action.payload as ISTMMessage).content) * 10) / 10}`
        }

        if ((action.payload as ISTMMessage).id === StmMessages.VolumetricGroup1 || (action.payload as ISTMMessage).id === StmMessages.VolumetricGroup2) {
          const volValue = parseInt((action.payload as ISTMMessage).content) || 1
          state.machine[(action.payload as ISTMMessage).id] = `${Converter.volumetric(volValue)}`
        }

        if ((action.payload as ISTMMessage).id === StmMessages.SteamPressure ||
          (action.payload as ISTMMessage).id === StmMessages.Group1Pressure || (action.payload as ISTMMessage).id === StmMessages.Group2Pressure) {
          const prValue = parseInt((action.payload as ISTMMessage).content) || 0
          state.machine[(action.payload as ISTMMessage).id] = `${Converter.compressure(prValue)}`
        }

        if ((action.payload as ISTMMessage).id === StmMessages.Group1Temperature) {
          const temp = Converter.voltToCelsium((action.payload as ISTMMessage).content)
          if(temp < 50 || temp > 110) {
            return state
          }
          state.life.tTrendG1.push({
            time: Date.now(),
            value: temp
          })
          state.life.tTrendG1 = [...state.life.tTrendG1]
          if (state.life.tTrendG1.length > 100) {
            state.life.tTrendG1.splice(0, 1)
            state.life.middleTTrendG1 = CreateMiddleTrend(state.life.tTrendG1)
            console.log("G1: ", state.life.middleTTrendG1)
            state.life.speedG1 = getSpeed(state.life.middleTTrendG1)
          }
        }

        if ((action.payload as ISTMMessage).id === StmMessages.Group2Temperature) {
          const temp = Converter.voltToCelsium((action.payload as ISTMMessage).content)
          if(temp < 50 || temp > 110) {
            return state
          }
          state.life.tTrendG2.push({
            time: Date.now(),
            value: temp
          })
          state.life.tTrendG2 = [...state.life.tTrendG2]
          if (state.life.tTrendG2.length > 100) {
            state.life.tTrendG2.splice(0, 1)
            state.life.middleTTrendG2 = CreateMiddleTrend(state.life.tTrendG2)
            console.log("G2: ", state.life.middleTTrendG2)
            state.life.speedG2 = getSpeed(state.life.middleTTrendG2)
          }
        }

        return { ...state, machine: { ...state.machine }, life: { ...state.life } };
      case ACTION_TYPES.settingsProfilesInitialize:
        state.choosenProfile = (action.payload as ISettingsProfilesMessage).settingsProfiles.choosenProfile
        state.profiles = [...(action.payload as ISettingsProfilesMessage).settingsProfiles.profiles]
        currentProfileIndex = getCurrentProfileIndex(state)
        return {
          ...state,
          settings: { ...state.profiles[currentProfileIndex].settings }
        };
      case ACTION_TYPES.setProfile:
        state.choosenProfile = action.payload as string
        currentProfileIndex = getCurrentProfileIndex(state)
        return {
          ...state,
          settings: { ...state.profiles[currentProfileIndex].settings },
        }
      case ACTION_TYPES.wifiStatusUpdate:
        return {
          ...state, wifiStatus: { ...(action.payload as IWifiStatus) }
        }
      case ACTION_TYPES.wifiListUpdate:
        return { ...state, availableWifiNets: (action.payload as IWifiNetListMessage).list }
    }
  } catch (e) {
    console.log(e)
  }
  return state;
}

export default rootReducer;
