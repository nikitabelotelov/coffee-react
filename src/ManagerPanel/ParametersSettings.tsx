import { NavLink } from "react-router-dom";
import * as React from "react";
import { getBackLink } from "../types";

const Parameters = [
  {
    key: 0,
    title: "Паровой бойлер",
    route: "steam"
  },
  {
    key: 1,
    title: "Температуры группы",
    route: "temp"
  },
  {
    key: 2,
    title: "Предсмачивания",
    route: "soaking"
  },
  {
    key: 3,
    title: "Время варки",
    route: "automode"
  },
  {
    key: 4,
    title: "Преднагревательный",
    route: "predict"
  }
];

export default function ParametersSettings() {
  return (
    <div className="setting__profile panel_root">
      <ul className="setting__profile-list list-group list-group-flush">
        {Parameters.map(el => {
          return (
            <NavLink to={`hand/${el.route}`} className="setting__hand-listItem list-group-item" key={el.key}>
              {el.title}
            </NavLink>
          );
        })}
      </ul>
      <NavLink
        to={getBackLink()}
        className="manager-panel__block "
      >
        Назад
      </NavLink>
    </div>
  );
}
