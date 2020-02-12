import { NavLink } from "react-router-dom";
import * as React from "react";
import { getBackLink, ISettingsState } from "../../types";
import NumberInput from "../NumberInput";
import settingStore from "../../SettingsStore/index";
import { setSetting } from "../../actions/index";
import { IAppState } from "../../reducers";
import { StmMessages } from "../../../server/stm/Converter";
import { connect } from "react-redux";


const GroupTemperature = (props: {settings: ISettingsState}) => {
  const value = Number(props.settings.Group1Temperature) || 0
  const value2 = Number(props.settings.Group2Temperature) || 0
  return (
    <div className="setting__profile-parameters2 panel_root">
      <div className="manager-panel__block manager-panel__top">
        <p>Температура группы 1</p>
        <NumberInput
          increment={(value:number) => {
            settingStore.dispatch(setSetting({
              id: 'Group1Temperature',
              content: `${value + 1}`
            }))
          }}
          decrement={(value:number) => {
            settingStore.dispatch(setSetting({
              id:'Group1Temperature',
              content: `${value - 1}`
            }))
          }}
          value={value}
        />

        <p>Температура группы 2</p>
        <NumberInput
          increment={(value:number) => {
            settingStore.dispatch(setSetting({
              id: 'Group2Temperature',
              content: `${value + 1}`
            }))
          }}
          decrement={(value:number) => {
            settingStore.dispatch(setSetting({
              id:'Group2Temperature',
              content: `${value - 1}`
            }))
          }}
          value={value2}
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

const GroupTemperatureConnected = connect(
  mapStateToProps
)(GroupTemperature);


export default GroupTemperatureConnected
