import {connect} from "react-redux";
import {RootView} from "./RootView";


const mapStateToProps = (state:any) => {
    return {
        machineState : state.machineState
    }
};

const Root = connect(
    mapStateToProps
)(RootView);

export default Root;