export interface IGroupSetting {
    temperature: number,
    value: number
}

export interface IGroupState {
    temperature: number,
    setting: IGroupSetting
}

export interface IPredictGroupSetting {
    temperature: number
}

export interface IPredictGroupState {
    temperature: number,
    setting: IPredictGroupSetting
}

export interface ISteamSetting {
    power: number
}

export interface ISteamState {
    power: number,
    setting: ISteamSetting
}

export interface IMachineState {
    group1: IGroupState,
    group2: IGroupState,
    predictGroup: IPredictGroupState,
    steam: ISteamState
}

export interface ISettingsState {
    g1TSet: 94,
    g2TSet: 92,
    g1TimeSet: 0,
    g2TimeSet: 0,
    g1AutoMode1: 0,
    g2AutoMode1: 0,
    g1_1TimeSet: 0,
    g2_1TimeSet: 0,
    steam: 1000,
    rCold: 0,
    gCold: 0,
    bCold: 16,
    aCold: 16,
    rHot: 16,
    gHot: 0,
    bHot: 0,
    aHot: 16
}

export interface IFullMachineState {
    settingsState: ISettingsState,
    machineState: IMachineState
}

export function getBackLink() {
    return location.pathname.split('/').slice(0, -1).join('/');
}