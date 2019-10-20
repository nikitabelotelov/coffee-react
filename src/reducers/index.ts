import ACTION_TYPES from "../actions/actionTypes";
import { IMachineState, ISettingsState } from "../types";
import { StmMessages, ISTMMessage } from "../../server/stm/Converter";


export type IAppState = IMachineState & ISettingsState;


const initialState: IAppState = {
  [StmMessages.SteamPressure]: "",
  [StmMessages.Group1Pressure]: "",
  [StmMessages.Group1Temperature]: "",
  [StmMessages.Group2Pressure]: "",
  [StmMessages.Group2Temperature]: "",
  [StmMessages.PredictGroupTemperature]: "",
  [StmMessages.Error1]: "",
  [StmMessages.SetGroup1Temperature]: "1000",
  [StmMessages.SetGroup1AutoMode1]: "200",
  [StmMessages.SetGroup1AutoMode2]: "400",
  [StmMessages.SetGroup2Temperature]: "1200",
  [StmMessages.SetGroup2AutoMode1]: "100",
  [StmMessages.SetGroup2AutoMode2]: "200",
  [StmMessages.SetSteamPressure]: "800",
  [StmMessages.SetRedCold]: "0",
  [StmMessages.SetGreenCold]: "0",
  [StmMessages.SetBlueCold]: "0",
  [StmMessages.SetRedHot]: "16",
  [StmMessages.SetGreenHot]: "16",
  [StmMessages.SetBlueHot]: "16"
};

function rootReducer(state: IAppState = initialState, action: {type: ACTION_TYPES, payload: ISTMMessage}) {
  switch (action.type) {
    case ACTION_TYPES.setSetting:
      state[action.payload.id] = action.payload.content;
      return { ...state };
    case ACTION_TYPES.currentInfoUpdate:
      state[action.payload.id] = action.payload.content;
      return { ...state };
  }
  return state;
}

export default rootReducer;
