import { StmMessages } from "../server/stm/Converter";

export interface IMachineState {
  [StmMessages.SteamPressure]: string;
  [StmMessages.Group1Pressure]: string;
  [StmMessages.Group1Temperature]: string;
  [StmMessages.Group2Pressure]: string;
  [StmMessages.Group2Temperature]: string;
  [StmMessages.PredictGroupTemperature]: string;
  [StmMessages.Error1]: string;
}

export interface ISettingsState {
  [StmMessages.SetGroup1Temperature]: string,
  [StmMessages.SetGroup1AutoMode1]: string,
  [StmMessages.SetGroup1AutoMode2]: string,
  [StmMessages.SetGroup2Temperature]: string,
  [StmMessages.SetGroup2AutoMode1]: string,
  [StmMessages.SetGroup2AutoMode2]: string,
  [StmMessages.SetSteamPressure]: string,
  [StmMessages.SetRedCold]: string,
  [StmMessages.SetGreenCold]: string,
  [StmMessages.SetBlueCold]: string,
  [StmMessages.SetRedHot]: string,
  [StmMessages.SetGreenHot]: string,
  [StmMessages.SetBlueHot]: string
}

export interface IFullMachineState {
  settingsState: ISettingsState;
  machineState: IMachineState;
}

export function getBackLink() {
  return location.pathname
    .split("/")
    .slice(0, -1)
    .join("/");
}
