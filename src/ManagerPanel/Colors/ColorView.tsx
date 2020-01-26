import { NavLink } from "react-router-dom";
import * as React from "react";
import { getBackLink } from "../../types";
import NumberInput from "../NumberInput";
import settingStore from "../../SettingsStore/index";
import { setSetting } from "../../actions/index";
import { IAppState } from "../../reducers";
import { StmMessages, StmCommands } from "../../../server/stm/Converter";
import { HuePicker, ColorResult, Color } from "react-color";

interface I16BitColor {
  red: number
  green: number
  blue: number
}

function hexTo16bit(hexColor: ColorResult): I16BitColor {
  let hex = hexColor.hex.slice(1)
  let red: number = Math.round(Number.parseInt(hex.slice(0, 2), 16) / 255 * 15)
  let green: number = Math.round(Number.parseInt(hex.slice(2, 4), 16) / 255 * 15)
  let blue: number = Math.round(Number.parseInt(hex.slice(4, 6), 16) / 255 * 15)
  return {red, green, blue}
}

function coldHandler(newColor: ColorResult): void {
  let parsedColor = hexTo16bit(newColor)
  console.log(parsedColor)
  settingStore.dispatch(setSetting({
    id: 'RedCold',
    content: `${parsedColor.red}` 
  }))
  settingStore.dispatch(setSetting({
    id: 'GreenCold',
    content: `${parsedColor.green}` 
  }))
  settingStore.dispatch(setSetting({
    id: 'BlueCold',
    content: `${parsedColor.blue}` 
  }))
}

function hotHandler(newColor: ColorResult): void {
  let parsedColor = hexTo16bit(newColor)
  console.log(parsedColor)
  settingStore.dispatch(setSetting({
    id: 'RedHot',
    content: `${parsedColor.red}` 
  }))
  settingStore.dispatch(setSetting({
    id: 'GreenHot',
    content: `${parsedColor.green}` 
  }))
  settingStore.dispatch(setSetting({
    id: 'BlueHot',
    content: `${parsedColor.blue}` 
  }))
}

const ColorView = (props: IAppState) => {
  let [cold, setCold] = React.useState("#0000FF")
  let [hot, setHot] = React.useState("#FF0000")
  return (
    <div className="setting__profile-parameters panel_root">
      <div className="setting__profile-parameters__color manager-panel__block manager-panel__top">
        <div className="manager-panel__block">
          <HuePicker color={cold} onChangeComplete={(color) => {
            coldHandler(color)
            setCold(color.hex)
          }} />
          <p>Холодная машина</p>
          <HuePicker color={hot} onChangeComplete={(color) => {
            hotHandler(color)
            setHot(color.hex)
          }} />
          <p>Горячая машина</p>
          <NavLink
            to={getBackLink()}
            className="manager-panel__block manager-panel__bottom">
            Назад
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default ColorView