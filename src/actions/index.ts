import ACTION_TYPES from './actionTypes';
import { IBasicMessage } from '../types';
import { emit } from '../SettingsStore';

export function setSetting(payload: IBasicMessage) {
    emit(payload);
    return {type: ACTION_TYPES.setSetting, payload}
};