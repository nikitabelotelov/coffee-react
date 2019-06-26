import ACTION_TYPES from './actionTypes';

interface ISetSettingAction {
    settingName: string,
    settingValue: number
}

export function setSetting(payload:ISetSettingAction) {
    return { type: ACTION_TYPES.setSetting, payload }
};