import {connect} from "react-redux";
import {RootView} from "./RootView";


const mapStateToProps = (state:any) => {
    return {
        machineState : state.machineState,
        settingsState : state.settingsState
    }
};

const Root = connect(
    mapStateToProps
)(RootView);

export default Root;