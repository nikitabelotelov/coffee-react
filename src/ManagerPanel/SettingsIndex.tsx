import {NavLink} from "react-router-dom";
import * as React from "react";
import {getBackLink} from "../types";

export default function Setting() {
    return (
        <div className='setting__root'>
            <NavLink to='setting/profile' className='manager-panel__block btn-outline-dark'>
                Выбор профиля
            </NavLink>
            <NavLink to='setting/color' className='manager-panel__block btn-outline-dark'>
                Цветовая схема
            </NavLink>
            <NavLink to='setting/update' className='manager-panel__block btn-outline-dark'>
                Обновление
            </NavLink>
            <NavLink to={getBackLink()} className='manager-panel__block btn-outline-success'>
                Назад
            </NavLink>
        </div>
    );
}