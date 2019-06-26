import ACTION_TYPES from '../actions/actionTypes';
import {IMachineState, ISettingsState} from "../types";

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

const initialSettingsState:ISettingsState = {
    g1TSet: 94,
    g2TSet: 92,
    g1TimeSet: 0,
    g2TimeSet: 0,
    g1AutoMode1: 0,
    g2AutoMode1: 0,
    g1_1TimeSet: 0,
    g2_1TimeSet: 0,
    steam: 1000,
    rCold: 0,
    gCold: 0,
    bCold: 16,
    aCold: 16,
    rHot: 16,
    gHot: 0,
    bHot: 0,
    aHot: 16
}

const initialState = {
    machineState: initialMachineState,
    settingsState: initialSettingsState
}

function rootReducer(state: any = initialState, action: any) {
    switch (action.type) {
        case ACTION_TYPES.setSetting:
            let settingsValueChanged = Object.assign({}, state.settingsState);
            settingsValueChanged[action.payload.settingName] = action.payload.settingValue;
            return Object.assign({}, state, { settingsState: settingsValueChanged });
        case ACTION_TYPES.currentInfoUpdate:
            return Object.assign({}, state, {machineState: action.payload.machineState});
    }
    return state;
};

export default rootReducer;