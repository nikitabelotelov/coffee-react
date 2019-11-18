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
      <div className="setting__profile-parameters__color manager-panel__block manager-panel__top">
      <div className="manager-panel__block">
        <p>Холодная машина</p>
        <p>Красный</p>
        <NumberInput
          increment={(value: number) => {
            settingStore.dispatch(setSetting({
              id: 'RedCold',
              content: `${value + 1}`
            }))
          }}
          decrement={(value: number) => {
            settingStore.dispatch(setSetting({
              id: 'RedCold',
              content: `${value - 1}`
            }))
          }}
          value={Number(props.settings.RedCold) || 0}
        />
        <p>Зеленый</p>
        <NumberInput
          increment={(value: number) => {
            settingStore.dispatch(setSetting({
              id: 'GreenCold',
              content: `${value + 1}`
            }))
          }}
          decrement={(value: number) => {
            settingStore.dispatch(setSetting({
              id: 'GreenCold',
              content: `${value - 1}`
            }))
          }}
          value={Number(props.settings.GreenCold) || 0}
        />
        <p>Синий</p>
        <NumberInput
          increment={(value: number) => {
            settingStore.dispatch(setSetting({
              id: 'BlueCold',
              content: `${value + 1}`
            }))
          }}
          decrement={(value: number) => {
            settingStore.dispatch(setSetting({
              id: 'BlueCold',
              content: `${value - 1}`
            }))
          }}
          value={Number(props.settings.BlueCold) || 0}
        />
        <p>Альфа</p>
        <NumberInput
          increment={(value: number) => {
            settingStore.dispatch(setSetting({
              id: 'AlphaCold',
              content: `${value + 1}`
            }))
          }}
          decrement={(value: number) => {
            settingStore.dispatch(setSetting({
              id: 'AlphaCold',
              content: `${value - 1}`
            }))
          }}
          value={Number(props.settings.AlphaCold) || 0}
        />
      </div>
      <div className="manager-panel__block">
        <p>Нагретая машина</p>
        <p>Красный</p>
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
        <p>Зеленый</p>
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
        <p>Синий</p>
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
        <p>Альфа</p>
        <NumberInput
          increment={(value: number) => {
            settingStore.dispatch(setSetting({
              id: 'AlphaHot',
              content: `${value + 1}`
            }))
          }}
          decrement={(value: number) => {
            settingStore.dispatch(setSetting({
              id: 'AlphaHot',
              content: `${value - 1}`
            }))
          }}
          value={Number(props.settings.AlphaHot) || 0}
        />
      </div>
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