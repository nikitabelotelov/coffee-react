import { NavLink } from "react-router-dom";
import * as React from "react";
import { getBackLink, ISettingsState } from "../../types";
import NumberInput from "../NumberInput";
import settingStore from "../../SettingsStore/index";
import { setSetting } from "../../actions/index";
import { IAppState } from "../../reducers";
import { StmMessages } from "../../../server/stm/Converter";
import { connect } from "react-redux";


const PreSoaking = (props: {settings: ISettingsState}) => {
  const value1 = Number(props.settings.Group1Presoaking) || 0
  const value2 = Number(props.settings.Group1PostPresoaking) || 0
  const value3 = Number(props.settings.Group2Presoaking) || 0
  const value4 = Number(props.settings.Group2PostPresoaking) || 0
  return (
    <div className="setting__profile-parameters panel_root">
      <div className="manager-panel__block manager-panel__top">
        <p>Группа 1: Время предсмачивания</p>
        <NumberInput
          increment={(value:number) => {
            settingStore.dispatch(setSetting({
              id: 'Group1Presoaking',
              content: `${value + 1}`
            }))
          }}
          decrement={(value:number) => {
            settingStore.dispatch(setSetting({
              id:'Group1Presoaking',
              content: `${value - 1}`
            }))
          }}
          value={value1}
        />
        <p>Группа 1: Время постпредсмачивания</p>
        <NumberInput
          increment={(value:number) => {
            settingStore.dispatch(setSetting({
              id: 'Group1PostPresoaking',
              content: `${value + 1}`
            }))
          }}
          decrement={(value:number) => {
            settingStore.dispatch(setSetting({
              id:'Group1PostPresoaking',
              content: `${value - 1}`
            }))
          }}
          value={value2}
        />

        <p>Группа 2: Время предсмачивания</p>
        <NumberInput
          increment={(value:number) => {
            settingStore.dispatch(setSetting({
              id: 'Group2Presoaking',
              content: `${value + 1}`
            }))
          }}
          decrement={(value:number) => {
            settingStore.dispatch(setSetting({
              id:'Group2Presoaking',
              content: `${value - 1}`
            }))
          }}
          value={value3}
        />
        <p>Группа 2: Время постпредсмачивания</p>
        <NumberInput
          increment={(value:number) => {
            settingStore.dispatch(setSetting({
              id: 'Group2PostPresoaking',
              content: `${value + 1}`
            }))
          }}
          decrement={(value:number) => {
            settingStore.dispatch(setSetting({
              id:'Group2PostPresoaking',
              content: `${value - 1}`
            }))
          }}
          value={value4}
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

const PreSoakingConnected = connect(
  mapStateToProps
)(PreSoaking);


export default PreSoakingConnected
