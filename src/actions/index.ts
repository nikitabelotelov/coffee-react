import ACTION_TYPES from './actionTypes';
import { IBasicMessage, ISettingsChangeMessage, IWifiAuthData } from '../types';
import { emitSettingsChange, emitChoosenProfileChange, emitConnectToWifi, emitUpdate } from '../SettingsStore';

export function setSetting(payload: IBasicMessage) {
    emitSettingsChange(payload)
    return {type: ACTION_TYPES.setSetting, payload}
};

export function setProfile
(payload: string) {
    emitChoosenProfileChange(payload)
    return {type: ACTION_TYPES.setProfile, payload}
};

export function connectWifiNet(payload: IWifiAuthData) {
    emitConnectToWifi(payload)
    return {type: ACTION_TYPES.connectingWifi, payload}
}

export function update() {
    emitUpdate()
    return {type: ACTION_TYPES.needUpdate, payload:'update'}
}