import { NavLink } from "react-router-dom";
import * as React from "react";
import { getBackLink, ISettingsState } from "../../types";
import NumberInput from "../NumberInput";
import settingStore from "../../SettingsStore/index";
import { setSetting } from "../../actions/index";
import { IAppState } from "../../reducers";
import { StmMessages } from "../../../server/stm/Converter";
import { connect } from "react-redux";


const AutoMode = (props: {settings: ISettingsState}) => {
  const value1 = Number(props.settings.Group1AutoMode1) || 0
  const value2 = Number(props.settings.Group2AutoMode1) || 0
  return (
    <div className="setting__profile-parameters2 panel_root">
      <div className="manager-panel__block manager-panel__top">
        <p>Группа 1: Объем варки</p>
        <NumberInput
          increment={(value:number) => {
            settingStore.dispatch(setSetting({
              id: 'Group1AutoMode1',
              content: `${value + 1}`
            }))
          }}
          decrement={(value:number) => {
            settingStore.dispatch(setSetting({
              id:'Group1AutoMode1',
              content: `${value - 1}`
            }))
          }}
          value={value1}
        />
        <p>Группа 2: Объем варки</p>
        <NumberInput
          increment={(value:number) => {
            settingStore.dispatch(setSetting({
              id: 'Group2AutoMode1',
              content: `${value + 1}`
            }))
          }}
          decrement={(value:number) => {
            settingStore.dispatch(setSetting({
              id:'Group2AutoMode1',
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
        &nbsp;&nbsp;&nbsp;&nbsp;Назад&nbsp;&nbsp;&nbsp;&nbsp;
      </NavLink>
    </div>
  );
}

const mapStateToProps = (state:IAppState) => {
  return {...state};
};

const AutoModeConnected = connect(
  mapStateToProps
)(AutoMode);


export default AutoModeConnected
