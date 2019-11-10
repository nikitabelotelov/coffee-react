import {connect} from "react-redux";
import SteamView from "./SteamView";
import { IAppState } from "../../reducers";
import { ISettingsState } from "../../types";


const mapStateToProps = (state:IAppState) => {
    return {...state};
};

const Steam = connect(
    mapStateToProps
)(SteamView);

export default Steam;