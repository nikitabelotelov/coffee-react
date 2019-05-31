import {connect} from "react-redux";
import SteamView from "./SteamView";


const mapStateToProps = (state:any) => {
    return {
        settingsState : state.settingsState
    }
};

const Steam = connect(
    mapStateToProps
)(SteamView);

export default Steam;