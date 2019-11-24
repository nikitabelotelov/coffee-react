import { NavLink } from "react-router-dom";
import * as React from "react";
import { getBackLink, IWifiNet } from "../types";
import { IAppState } from "../reducers";
import settingsStore from "../SettingsStore"
import { connect } from "react-redux";
import { connectWifiNet } from "../actions";

const wifiNets: Array<IWifiNet> = [
    {
        ssid: "test-network"
    }
]

export function WifiView(opts: IAppState) {
    return (
        <div className='wifi__root panel_root'>
            <ul className='list__root'>
                {opts.availableWifiNets.map((el, key) => {
                    return (<li className={'list-group-item '}  key={key}>{el.ssid}</li>)
                })}
            </ul>
            <div onClick={() => {
                        settingsStore.dispatch(connectWifiNet({ ssid: 'testssid', password: 'privet' }))
                    }} className='manager-panel__block manager-panel__topright'>
                Подключиться
                <input type="password"/>
            </div>
            <NavLink to={getBackLink()} className='manager-panel__block manager-panel__bottomright'>
                Назад
            </NavLink>
        </div>
    );
}


const mapStateToProps = (state:IAppState) => {
    return {...state};
}

export const Wifi = connect(mapStateToProps)(WifiView);