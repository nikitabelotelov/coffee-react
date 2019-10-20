import { NavLink } from "react-router-dom";
import * as React from "react";
import { getBackLink } from "../../types";
import NumberInput from "../NumberInput";
import settingStore from "../../SettingsStore/index";
import { setSetting } from "../../actions/index";
import { IAppState } from "../../reducers";
import { StmMessages } from "../../../server/stm/Converter";

const ColorHotView = (props: IAppState) => {
  return (
    <div className="setting__profile-parameters panel_root">
      <div className="manager-panel__block manager-panel__top">
        <p>Красный(нагретая машина)</p>
        <NumberInput
          increment={(value: number) => {
            settingStore.dispatch(setSetting({
              id: StmMessages.SetRedHot,
              content: `${value + 1}`
            }))
          }}
          decrement={(value: number) => {
            settingStore.dispatch(setSetting({
              id: StmMessages.SetRedHot,
              content: `${value - 1}`
            }))
          }}
          value={Number(props[StmMessages.SetRedHot]) || 0}
        />
        <p>Зеленый(нагретая машина)</p>
        <NumberInput
          increment={(value: number) => {
            settingStore.dispatch(setSetting({
              id: StmMessages.SetGreenHot,
              content: `${value + 1}`
            }))
          }}
          decrement={(value: number) => {
            settingStore.dispatch(setSetting({
              id: StmMessages.SetGreenCold,
              content: `${value - 1}`
            }))
          }}
          value={Number(props[StmMessages.SetGreenHot]) || 0}
        />
        <p>Синий(нагретая машина)</p>
        <NumberInput
          increment={(value: number) => {
            settingStore.dispatch(setSetting({
              id: StmMessages.SetBlueHot,
              content: `${value + 1}`
            }))
          }}
          decrement={(value: number) => {
            settingStore.dispatch(setSetting({
              id: StmMessages.SetBlueHot,
              content: `${value - 1}`
            }))
          }}
          value={Number(props[StmMessages.SetBlueHot]) || 0}
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