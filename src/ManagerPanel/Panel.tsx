import * as React from 'react';

import './Panel.less';
import { NavLink, Route } from 'react-router-dom';

interface IPanelState {

}

interface IGroupSetting {
    temperature: number,
    value: number
}

interface IGroupState {
    temperature: number,
    setting: IGroupSetting
}

interface IPredictGroupSetting {
    temperature: number
}

interface IPredictGroupState {
    temperature: number,
    setting: IPredictGroupSetting
}

interface ISteamSetting {
    power: number
}

interface ISteamState {
    power: number,
    setting: ISteamSetting
}

interface IMachineState {
    group1: IGroupState,
    group2: IGroupState,
    predictGroup: IPredictGroupState,
    steam: ISteamState
}

const DataMachine:IMachineState = {
    group1: {
        temperature: 92,
        setting: {
            temperature: 93,
            value: 120
        }
    },
    group2: {
        temperature: 92,
        setting: {
            temperature: 92,
            value: 120
        }
    },
    predictGroup: {
        temperature: 85,
        setting: {
            temperature: 85
        }
    },
    steam: {
        power: 1000,
        setting: {
            power: 1000
        }
    }
}

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

function Root() {
    return (
        <div className='manager-panel__root'>
            <div className='manager-panel__block btn-outline-dark manager-panel__topleft '>
                <b>Группа 1</b><br/>
                Температура: {DataMachine.group1.temperature} C / {DataMachine.group1.setting.temperature} C<br/>
                Пролив: {DataMachine.group1.setting.value} ml
            </div>
            <div className='manager-panel__block btn-outline-dark manager-panel__topright'>
                <b>Группа 1</b><br/>
                Температура: {DataMachine.group2.temperature} C / {DataMachine.group2.setting.temperature} C<br/>
                Пролив: {DataMachine.group2.setting.value} ml
            </div>
            <div className='manager-panel__block btn-outline-dark manager-panel__middleleft'>
                <b>Преднагревательный</b><br/>
                Температура: {DataMachine.predictGroup.temperature} C / {DataMachine.predictGroup.setting.temperature} C
            </div>
            <div className='manager-panel__block btn-outline-dark manager-panel__bottomleft'>
                <b>Паровой</b><br />
                Давление: {DataMachine.steam.power/1000} / {DataMachine.steam.setting.power/1000}
            </div>
            <NavLink to='manage/setting' className='manager-panel__block btn-outline-dark manager-panel__bottomright'>
                Настройки
            </NavLink>
        </div>
    );
}

function getBackLink() {
    return location.pathname.split('/').slice(0, -1).join('/');
}

function Setting() {
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


export class Panel extends React.Component<any, IPanelState> {

    render() {
        return (
            <React.Fragment>
                <Route exact path='*/manage' component={Root} />
                <Route exact path='*/manage/setting' component={Setting} />
                <Route exact path='*/manage/setting/profile' component={Profile} />
            </React.Fragment>
        )
    }
}
