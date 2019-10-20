import { NavLink } from "react-router-dom";
import * as React from "react";
import { getBackLink } from "../../types";
import NumberInput from "../NumberInput";
import settingStore from "../../SettingsStore/index";
import { setSetting } from "../../actions/index";
import { IAppState } from "../../reducers";
import { StmMessages } from "../../../server/stm/Converter";


const SteamView = (props: IAppState) => {
  const value = Number(props[StmMessages.SetSteamPressure]) || 0
  return (
    <div className="setting__profile-parameters panel_root">
      <div className="manager-panel__block manager-panel__top">
        <p>Давление парового бойлера</p>
        <NumberInput
          increment={() => {
            settingStore.dispatch(setSetting({
              id: StmMessages.SetSteamPressure,
              content: `${value + 1}`
            }))
          }}
          decrement={() => {
            settingStore.dispatch(setSetting({
              id: StmMessages.SetSteamPressure,
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
