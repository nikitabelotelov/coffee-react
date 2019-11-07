import { StmMessages, StmCommands } from "../server/stm/Converter";
import { Process } from "./actions/Process";

export type IObjectAny = {
  [propname: string]: any
}


export enum ProcessStatus {
  wip = 'wip',
  done = 'done',
  error = 'error',
  stopped = 'stopped'
}

export interface IMachineState {
  [StmMessages.SteamPressure]: string;
  [StmMessages.Group1Pressure]: string;
  [StmMessages.Group1Temperature]: string;
  [StmMessages.Group2Pressure]: string;
  [StmMessages.Group2Temperature]: string;
  [StmMessages.PredictGroupTemperature]: string;
  [StmMessages.Error]: string;
  [StmMessages.Valve1]: string;
  [StmMessages.Valve2]: string;
  [StmMessages.Valve3]: string;
  [StmMessages.Valve4]: string;
  [StmMessages.Valve5]: string;
  [StmMessages.Valve6]: string;
  [StmMessages.Relay1]: string;
  [StmMessages.Relay2]: string;
  [StmMessages.Relay3]: string;
  [StmMessages.Relay4]: string;
  [StmMessages.Relay5]: string;
  [StmMessages.Relay6]: string;
  [StmMessages.Relay7]: string;
  [StmMessages.Relay8]: string;
  [StmMessages.Echo]: string;
  [StmMessages.WaterLevel]: string;
  [StmMessages.Button1]: string;
  [StmMessages.Button2]: string;
  [StmMessages.Button3]: string;
  [StmMessages.Button4]: string;
  [StmMessages.Button5]: string;
  [StmMessages.Button6]: string;
  [StmMessages.Button7]: string;
  [StmMessages.Button8]: string;
  [StmMessages.Button9]: string;

  [StmMessages.VolumetricGroup1]: string;
  [StmMessages.VolumetricGroup2]: string;
}

export interface ISettingsState {
    Group1Temperature: string,
    Group1AutoMode1: string,
    Group1AutoMode2: string,
    Group2Temperature: string,
    Group2AutoMode1: string,
    Group2AutoMode2: string,
    SteamPressure: string,
    RedCold: string,
    GreenCold: string,
    BlueCold: string,
    RedHot: string,
    GreenHot: string,
    BlueHot: string,
    EnergyMode: string
}

export interface ICommandBlock {
  [StmCommands.SetValve1]: number
  [StmCommands.SetValve2]: number
  [StmCommands.SetValve3]: number
  [StmCommands.SetValve4]: number
  [StmCommands.SetValve5]: number
  [StmCommands.SetValve6]: number
  
  [StmCommands.SetRelay1]: number
  [StmCommands.SetRelay2]: number
  [StmCommands.SetRelay3]: number
  [StmCommands.SetRelay4]: number
  [StmCommands.SetRelay5]: number
  [StmCommands.SetRelay6]: number
  [StmCommands.SetRelay7]: number
  [StmCommands.SetRelay8]: number

  [StmCommands.SetRedGroup1]: number
  [StmCommands.SetGreenGroup1]: number
  [StmCommands.SetBlueGroup1]: number
  [StmCommands.SetRedGroup2]: number
  [StmCommands.SetGreenGroup2]: number
  [StmCommands.SetBlueGroup2]: number
  
  [StmCommands.SetRedMachine]: number
  [StmCommands.SetGreenMachine]: number
  [StmCommands.SetBlueMachine]: number

  [StmCommands.ResetVolumetricG1]: number
  [StmCommands.ResetVolumetricG2]: number

  [StmCommands.SetSecGroup1]: number
  [StmCommands.SetSecGroup2]: number
}

export interface IBasicMessage {
  id: Extract<keyof ISettingsState, string>, 
  content: string
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
