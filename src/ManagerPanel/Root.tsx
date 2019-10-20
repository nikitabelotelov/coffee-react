import {connect} from "react-redux";
import {RootView} from "./RootView";
import { IAppState } from "../reducers";

const mapStateToProps = (state:IAppState) => {
    return {...state}
};

const Root = connect(
    mapStateToProps
)(RootView);

export default Root;