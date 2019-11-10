import {NavLink} from "react-router-dom";
import * as React from "react";
import {getBackLink} from "../types";
import { IAppState } from "../reducers";

const Profiles = [
    {
        key: 0,
        title: 'Автоматическая'
    },
    {
        key: 1,
        title: 'Ручная'
    },
    {
        key: 2,
        title: 'Арабика'
    },
    {
        key: 3,
        title: 'Бразилия'
    }
]

export default function ProfileView(opts:IAppState) {
    return (
        <div className='setting__profile panel_root'>
            <ul className='setting__profile-list list-group list-group-flush'>
                {opts.settingsProfiles.profiles.map((el, key)=>{
                    return (<li className='list-group-item' key={key}>{el.title}</li>)
                })}
            </ul>
            <NavLink to='profile/hand' className='manager-panel__block btn-outline-dark'>
                Настройка по параметрам
            </NavLink>
            <NavLink to={getBackLink()} className='manager-panel__block btn-outline-success'>
                Назад
            </NavLink>
        </div>
    );
}