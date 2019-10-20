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
        Температура: {props[StmMessages.Group1Temperature]} C /{" "}
        {props[StmMessages.SetGroup1Temperature]} C<br />
      </div>
      <div className="manager-panel__block btn-outline-dark manager-panel__topright">
        <b>Группа 2</b>
        <br />
        Температура: {props[StmMessages.Group2Temperature]} C /{" "}
        {props[StmMessages.SetGroup2Temperature]} C<br />
      </div>
      <div className="manager-panel__block btn-outline-dark manager-panel__middleleft">
        <b>Преднагревательный</b>
        <br />
        Температура: {props[StmMessages.PredictGroupTemperature]} C
      </div>
      <div className="manager-panel__block btn-outline-dark manager-panel__bottomleft">
        <b>Паровой</b>
        <br />
        Давление: {props[StmMessages.SteamPressure]} /{" "}
        {props[StmMessages.SetSteamPressure]}
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
