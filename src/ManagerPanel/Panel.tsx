import * as React from 'react';

import './Panel.css';
import { NavLink, Route } from 'react-router-dom';
import Root from './Root';
import SettingsIndex  from './SettingsIndex';
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

function Profile() {
    return (
        <div className='setting__profile'>
            <ul className='setting__profile-list list-group list-group-flush'>
                {Profiles.map((el)=>{
                    return (<li className='list-group-item' key={el.key}>{el.title}</li>)
                })}
            </ul>
            <NavLink to='profile/hand' className='manager-panel__block btn-outline-warning'>
                Настройка по параметрам
            </NavLink>
            <NavLink to={getBackLink()} className='manager-panel__block btn-outline-success'>
                Назад
            </NavLink>
        </div>
    );
}

export class Panel extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Route exact path='*/manage' component={Root} />
                <Route exact path='*/manage/settings' component={SettingsIndex} />
            </React.Fragment>
        )
    }
}
