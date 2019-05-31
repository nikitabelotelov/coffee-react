import {NavLink} from "react-router-dom";
import * as React from "react";
import {getBackLink} from "../types";

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

export default function Profile() {
    return (
        <div className='setting__profile panel_root'>
            <ul className='setting__profile-list list-group list-group-flush'>
                {Profiles.map((el)=>{
                    return (<li className='list-group-item' key={el.key}>{el.title}</li>)
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