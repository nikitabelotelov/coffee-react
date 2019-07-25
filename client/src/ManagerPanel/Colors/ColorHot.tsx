import {connect} from "react-redux";
import ColorHotView from "./ColorHotView";


const mapStateToProps = (state:any) => {
    return {
        settingsState : state.settingsState
    }
};

const ColorHot = connect(
    mapStateToProps
)(ColorHotView);

export default ColorHot;