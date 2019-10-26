import ACTION_TYPES from "../actions/actionTypes";
import { IMachineState, ISettingsState, IBasicMessage } from "../types";
import { StmMessages, ISTMMessage, ISTMCommand } from "../../server/stm/Converter";


export interface IAppState {
  machine: IMachineState
  settings: ISettingsState
  life: {
    relay8: number
    godMod: number
  }
  update: number
}


const initialState: IAppState = {
  update: 0,
  life: {
    relay8: 0,
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
    BlueHot: '0'
  }
}

function rootReducer(state: IAppState = initialState, action: {type: ACTION_TYPES, payload: ISTMMessage | IBasicMessage | ISTMCommand | null}) {
  switch (action.type) {
    case ACTION_TYPES.setSetting:
      state.settings[(action.payload as IBasicMessage).id] = action.payload.content;
      return { ...state, settings: {...state.settings} };
    case ACTION_TYPES.currentInfoUpdate:
      state.machine[(action.payload as ISTMMessage).id] = action.payload.content;
      return { ...state, machine: {...state.machine} };
  }
  return state;
}

export default rootReducer;
