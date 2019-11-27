import { NavLink } from "react-router-dom";
import React, { useState, useRef } from 'react';
import { getBackLink, IWifiNet } from "../types";
import { IAppState } from "../reducers";
import settingsStore from "../SettingsStore"
import { connect } from "react-redux";
import { connectWifiNet } from "../actions";
import { text } from "body-parser";

const wifiNets: Array<IWifiNet> = [
    {
        ssid: "test-network"
    }
]

export function WifiView(opts: IAppState) {
    const [choosenNetwork, setChoosenNetwork] = useState(null)
    const textInput = useRef(null)

    return (
        <div className='wifi__root panel_root'>
            <ul className='list__root'>
                {opts.availableWifiNets.map((el, key) => {
                    return (<li className={'list-group-item' + (el.ssid === choosenNetwork ? ' list-group-item__selected' : '')} onClick={() => {
                        setChoosenNetwork(el.ssid)
                    }} key={key}>{el.ssid}</li>)
                })}
            </ul>
            <div onClick={() => {
                if (choosenNetwork) {
                    settingsStore.dispatch(connectWifiNet({ ssid: choosenNetwork, password: textInput.current.value }))
                }
            }} className='manager-panel__block manager-panel__topright'>
                Подключиться
            </div>
            <input ref={textInput} type="text" />
            <NavLink to={getBackLink()} className='manager-panel__block manager-panel__bottomright'>
                Назад
            </NavLink>
        </div>
    );
}


const mapStateToProps = (state: IAppState) => {
    return { ...state };
}

export const Wifi = connect(mapStateToProps)(WifiView);