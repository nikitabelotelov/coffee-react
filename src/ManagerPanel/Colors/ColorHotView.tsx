import { NavLink } from "react-router-dom";
import * as React from "react";
import { getBackLink } from "../../types";
import NumberInput from "../NumberInput";
import settingStore from "../../SettingsStore/index";
import { setSetting } from "../../actions/index";
import { IAppState } from "../../reducers";
import { StmMessages, StmCommands } from "../../../server/stm/Converter";

const ColorHotView = (props: IAppState) => {
  return (
    <div className="setting__profile-parameters panel_root">
      <div className="manager-panel__block manager-panel__top">
        <p>Красный(нагретая машина)</p>
        <NumberInput
          increment={(value: number) => {
            settingStore.dispatch(setSetting({
              id: 'RedHot',
              content: `${value + 1}`
            }))
          }}
          decrement={(value: number) => {
            settingStore.dispatch(setSetting({
              id: 'RedHot',
              content: `${value - 1}`
            }))
          }}
          value={Number(props.settings.RedHot) || 0}
        />
        <p>Зеленый(нагретая машина)</p>
        <NumberInput
          increment={(value: number) => {
            settingStore.dispatch(setSetting({
              id: 'GreenHot',
              content: `${value + 1}`
            }))
          }}
          decrement={(value: number) => {
            settingStore.dispatch(setSetting({
              id: 'GreenHot',
              content: `${value - 1}`
            }))
          }}
          value={Number(props.settings.GreenHot) || 0}
        />
        <p>Синий(нагретая машина)</p>
        <NumberInput
          increment={(value: number) => {
            settingStore.dispatch(setSetting({
              id: 'BlueHot',
              content: `${value + 1}`
            }))
          }}
          decrement={(value: number) => {
            settingStore.dispatch(setSetting({
              id: 'BlueHot',
              content: `${value - 1}`
            }))
          }}
          value={Number(props.settings.BlueHot) || 0}
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

export default ColorHotView