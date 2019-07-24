import ACTION_TYPES from './actionTypes';
import {emit} from '../actions/websockets';

interface ISetSettingAction {
    settingName: string,
    settingValue: number
}

export function setSetting(payload: ISetSettingAction) {
    emit("newSettings", payload);
    return {type: ACTION_TYPES.setSetting, payload}
};