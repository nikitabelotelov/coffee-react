import ACTION_TYPES from '../actions/actionTypes';
import {IMachineState} from "../types";

const initialMachineState:IMachineState = {
    group1: {
        temperature: 95,
        setting: {
            temperature: 93,
            value: 120
        }
    },
    group2: {
        temperature: 92,
        setting: {
            temperature: 92,
            value: 120
        }
    },
    predictGroup: {
        temperature: 85,
        setting: {
            temperature: 85
        }
    },
    steam: {
        power: 1000,
        setting: {
            power: 1000
        }
    }
};

const initialState = {
    machineState: initialMachineState
}

function settingsReducer(state: any = initialState, action: any) {
    return state;
};

export default settingsReducer;