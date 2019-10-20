import { connect } from "react-redux";
import ColorHotView from "./ColorHotView";
import { IAppState } from "../../reducers";

const mapStateToProps = (state: IAppState) => {
  return { ...state };
};

const ColorHot = connect(mapStateToProps)(ColorHotView);

export default ColorHot;
