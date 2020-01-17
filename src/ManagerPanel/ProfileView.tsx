import {NavLink} from "react-router-dom"
import * as React from "react"
import settingStore from "../SettingsStore/index"
import {setProfile} from "../actions/index"
import {getBackLink} from "../types"
import { IAppState } from "../reducers"

const userProfileName = 'Пользовательские'

export default function ProfileView(opts:IAppState) {
    return (
        <div className='setting__profile panel_root'>
            <ul className='list__root'>
                {opts.profiles.map((el, key)=>{
                    return (<li onClick={() => {
                        settingStore.dispatch(setProfile(el.title))
                    }} className={'list-group-item' + (el.title === opts.choosenProfile ? ' list-group-item__selected' : '')} key={key}>{el.title}</li>)
                })}
            </ul>
            <NavLink onClick={() => {
                        settingStore.dispatch(setProfile(userProfileName))
                    }} to='profile/hand' className='manager-panel__block '>
                Настройка по параметрам
            </NavLink>
            <NavLink to={getBackLink()} className='manager-panel__block '>
                Назад
            </NavLink>
        </div>
    );
}