import { NavLink } from "react-router-dom";
import * as React from "react";
import { getBackLink, ISettingsState } from "../../types";
import NumberInput from "../NumberInput";
import settingStore from "../../SettingsStore/index";
import { setSetting } from "../../actions/index";
import { IAppState } from "../../reducers";
import { StmMessages } from "../../../server/stm/Converter";


const SteamView = (props: {settings: ISettingsState}) => {
  const value = Number(props.settings.SteamPressure) || 0
  return (
    <div className="setting__profile-parameters panel_root">
      <div className="manager-panel__block manager-panel__top">
        <p>Давление парового бойлера</p>
        <NumberInput
          increment={(value:number) => {
            settingStore.dispatch(setSetting({
              id: 'SteamPressure',
              content: `${value + 1}`
            }))
          }}
          decrement={(value:number) => {
            settingStore.dispatch(setSetting({
              id:'SteamPressure',
              content: `${value - 1}`
            }))
          }}
          value={value}
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

export default SteamView
