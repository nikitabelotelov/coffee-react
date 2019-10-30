import ACTION_TYPES from './actionTypes';
import { IBasicMessage } from '../types';
import { emitSettingsChange } from '../SettingsStore';

export function setSetting(payload: IBasicMessage) {
    emitSettingsChange(payload);
    return {type: ACTION_TYPES.setSetting, payload}
};