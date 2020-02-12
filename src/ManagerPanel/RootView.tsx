import { NavLink } from "react-router-dom";
import * as React from "react";
import { IAppState } from "../reducers";
import { StmMessages } from "../../server/stm/Converter";

export function RootView(props: IAppState) {
  const tg1 = Math.round((props.life.tTrendG1.length ? props.life.tTrendG1[props.life.tTrendG1.length - 1].value : 0) * 10)/10
  const tg2 = Math.round((props.life.tTrendG2.length ? props.life.tTrendG2[props.life.tTrendG2.length - 1].value : 0) * 10)/10
  const realSteam = Math.round((parseFloat(props.machine[StmMessages.SteamPressure]) / 20)) / 10
  return (
    <div className="manager-panel__root panel_root">
      <div className="manager-panel__block manager-panel__topleft ">
        <b>Группа 1</b>
        <br />
        {tg1} C /{" "}{props.settings.Group1Temperature} C
      </div>
      <div className="manager-panel__block manager-panel__topright">
        <b>Группа 2</b>
        <br />
        {tg2} C /{" "}
        {props.settings.Group2Temperature} C
      </div>
      <NavLink to="/admin" className="manager-panel__block manager-panel__middleright">
        <b>Преднагревательный</b>
        <br />
        {props.machine[StmMessages.PredictGroupTemperature]} C
      </NavLink>
      <div className={`manager-panel__block manager-panel__bottomleft ${props.machine[StmMessages.WaterLevel] === '1' ? 'manager-panel__steam-haswater' : ''}`}>
        <b>Паровой</b>
        <br />
        Давление: {realSteam} /{" "}
        {props.settings.SteamPressure}
      </div>
      <NavLink
        to="/settings"
        className="manager-panel__block manager-panel__bottomright"
      >
        Настройки
      </NavLink>
    </div>
  );
}
