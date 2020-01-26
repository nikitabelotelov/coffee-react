import { connect } from "react-redux";
import ColorView from "./ColorView";
import { IAppState } from "../../reducers";

const mapStateToProps = (state: IAppState) => {
  return { ...state };
};

const Color = connect(mapStateToProps)(ColorView);

export default Color;
