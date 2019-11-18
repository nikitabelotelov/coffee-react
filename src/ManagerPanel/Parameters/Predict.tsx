import { NavLink } from "react-router-dom";
import * as React from "react";
import { getBackLink, ISettingsState } from "../../types";
import NumberInput from "../NumberInput";
import settingStore from "../../SettingsStore/index";
import { setSetting } from "../../actions/index";
import { IAppState } from "../../reducers";
import { StmMessages } from "../../../server/stm/Converter";
import { connect } from "react-redux";


const Predict = (props: {settings: ISettingsState}) => {
  const value1 = Number(props.settings.PredictTemperature) || 0
  return (
    <div className="setting__profile-parameters panel_root">
      <div className="manager-panel__block manager-panel__top">
        <p>Группа 1: Температура в преднагреве</p>
        <NumberInput
          increment={(value:number) => {
            settingStore.dispatch(setSetting({
              id: 'PredictTemperature',
              content: `${value + 1}`
            }))
          }}
          decrement={(value:number) => {
            settingStore.dispatch(setSetting({
              id:'PredictTemperature',
              content: `${value - 1}`
            }))
          }}
          value={value1}
        />
        
      </div>
      <NavLink
        to={getBackLink()}
        className="manager-panel__block manager-panel__bottom"
      >
        Назад
      </NavLink>
    </div>
  );
}

const mapStateToProps = (state:IAppState) => {
  return {...state};
};

const PredictConnected = connect(
  mapStateToProps
)(Predict);


export default PredictConnected
