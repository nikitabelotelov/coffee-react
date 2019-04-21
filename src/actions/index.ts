import ACTION_TYPES from './actionTypes';
export function addSetting(payload:any) {
    return { type: ACTION_TYPES.addSetting, payload }
};