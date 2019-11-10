import ACTION_TYPES from './actionTypes';
import { IBasicMessage, ISettingsChangeMessage } from '../types';
import { emitSettingsChange, emitChoosenProfileChange } from '../SettingsStore';

export function setSetting(payload: IBasicMessage) {
    emitSettingsChange(payload);
    return {type: ACTION_TYPES.setSetting, payload}
};

export function setProfile
(payload: string) {
    emitChoosenProfileChange(payload);
    return {type: ACTION_TYPES.setProfile, payload}
};