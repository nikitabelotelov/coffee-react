import { NavLink } from "react-router-dom";
import * as React from "react";
import { IAppState } from "../reducers";
import { StmMessages } from "../../server/stm/Converter";

export function RootView(props: IAppState) {
  return (
    <div className="manager-panel__root panel_root">
      <div className="manager-panel__block btn-outline-dark manager-panel__topleft ">
        <b>Группа 1</b>
        <br />
        Температура: {props.machine[StmMessages.Group1Temperature]} C /{" "}
        {props.settings.Group1Temperature} C<br />
      </div>
      <div className="manager-panel__block btn-outline-dark manager-panel__topright">
        <b>Группа 2</b>
        <br />
        Температура: {props.machine[StmMessages.Group2Temperature]} C /{" "}
        {props.settings.Group2Temperature} C<br />
      </div>
      <div className="manager-panel__block btn-outline-dark manager-panel__middleleft">
        <b>Преднагревательный</b>
        <br />
        Температура: {props.machine[StmMessages.PredictGroupTemperature]} C
      </div>
      <div className="manager-panel__block btn-outline-dark manager-panel__bottomleft">
        <b>Паровой</b>
        <br />
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
