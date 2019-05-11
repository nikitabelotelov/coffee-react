import ACTION_TYPES from '../actions/actionTypes';

const initialState = {
    settings: ['huisosi']
};

function rootReducer(state: any = initialState, action: any) {
    if (action.type === ACTION_TYPES.addSetting) {
        return Object.assign({}, state, {
            settings: state.settings.concat(action.payload)
        });
    }
    return state;
};

export default rootReducer;