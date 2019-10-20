import ACTION_TYPES from './actionTypes';
import {emit} from '../actions/websockets';
import { ISTMMessage } from '../../server/stm/Converter';

export function setSetting(payload: ISTMMessage) {
    emit(payload);
    return {type: ACTION_TYPES.setSetting, payload}
};