import { NavLink } from "react-router-dom";
import * as React from "react";
import { IAppState } from "../reducers";
import { StmMessages } from "../../server/stm/Converter";

export function RootView(props: IAppState) {
  const tg1 = props.life.middleTTrendG1.length ? props.life.middleTTrendG1[props.life.middleTTrendG1.length - 1] : 0
  const tg2 = props.life.middleTTrendG2.length ? props.life.middleTTrendG2[props.life.middleTTrendG2.length - 1] : 0
  return (
    <div className="manager-panel__root panel_root">
      <div className="manager-panel__block btn-outline-dark manager-panel__topleft ">
        <b>Группа 1</b>
        Температура: {props.machine[StmMessages.Group1Temperature]} {tg1} C /{" "}
        {props.settings.Group1Temperature} C P = {props.machine[StmMessages.Group1Pressure]}
      </div>
      <div className="manager-panel__block btn-outline-dark manager-panel__topright">
        <b>Группа 2</b>
        Температура: {props.machine[StmMessages.Group2Temperature]} {tg2} C /{" "}
        {props.settings.Group2Temperature} C P = {props.machine[StmMessages.Group2Pressure]}
      </div>
      <div className="manager-panel__block btn-outline-dark manager-panel__middleleft">
        <b>Преднагревательный</b>
        <br />
        Температура: {props.machine[StmMessages.PredictGroupTemperature]} C
      </div>
      <div className="manager-panel__block btn-outline-dark manager-panel__bottomleft">
        <b>Паровой</b>
        Уровень: {props.machine[StmMessages.WaterLevel]} <br />
        Давление: {props.machine[StmMessages.SteamPressure]} /{" "}
        {props.settings.SteamPressure}
      </div>
      <NavLink
        to="/settings"
        className="manager-panel__block btn-outline-dark manager-panel__bottomright"
      >
        Настройки
      </NavLink>
    </div>
  );
}
