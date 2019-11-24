import {NavLink} from "react-router-dom";
import * as React from "react";
import {getBackLink} from "../types";

export default function Setting() {
    return (
        <div className='setting__root panel_root'>
            <NavLink to='settings/profile' className='manager-panel__block manager-panel__topleft'>
                Выбор профиля
            </NavLink>
            <NavLink to='settings/wifi' className='manager-panel__block manager-panel__topmiddle'>
                Wi-Fi
            </NavLink>
            <NavLink to='settings/color' className='manager-panel__block manager-panel__bottommleft'>
                Цветовая схема
            </NavLink>
            <NavLink to='settings/update' className='manager-panel__block manager-panel__bottommiddle'>
                Обновление
            </NavLink>
            <NavLink to={getBackLink()} className='manager-panel__block manager-panel__right'>
                Назад
            </NavLink>
        </div>
    );
}