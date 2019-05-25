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

export function getBackLink() {
    return location.pathname.split('/').slice(0, -1).join('/');
}