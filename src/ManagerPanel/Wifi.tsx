import { NavLink } from "react-router-dom";
import React, { useState, useRef, useEffect } from 'react';
import { getBackLink, IWifiNet, WIFI_STATUS } from "../types";
import { IAppState } from "../reducers";
import settingsStore from "../SettingsStore"
import { connect } from "react-redux";
import { connectWifiNet } from "../actions";
import { checkConnection } from "../actions/NetChecker";

export function WifiView(opts: IAppState) {
    const [choosenNetwork, setChoosenNetwork] = useState(null)
    const [netStatus, setNetStatus] = useState(false)
    let interval: number
    useEffect(() => {
        interval = window.setInterval(() => {
            checkConnection().then((res) => {
                setNetStatus(res)
            })
        }, 5000)
        return () => {
            clearInterval(interval)
        }
    }, [])
    const textInput = useRef(null)

    return (
        <div className='wifi__root panel_root'>
            <ul className='list__root'>
                {opts.availableWifiNets.map((el, key) => {
                    return (<li className={'list-group-item' + (el.ssid === choosenNetwork ? ' list-group-item__selected' : '')} onClick={() => {
                        setChoosenNetwork(el.ssid)
                    }} key={key}>{el.ssid} {(opts.wifiStatus.wifiStatus === WIFI_STATUS.CONNECTED && el.ssid === opts.wifiStatus.currentWifiNet.ssid) ? "*" : '' }
                         {(opts.wifiStatus.wifiStatus === WIFI_STATUS.CONNECTING && el.ssid === opts.wifiStatus.currentWifiNet.ssid) ? "CONNECTING" : '' }</li>)
                })}
            </ul>
            <div onClick={() => {
                if (choosenNetwork) {
                    settingsStore.dispatch(connectWifiNet({ ssid: choosenNetwork, password: textInput.current.value }))
                }
            }} className='manager-panel__block manager-panel__topright'>
                Подключиться
            </div>
            <input placeholder="введите пароль" ref={textInput} type="text" />
            <div className="wifi__status">Статус сети:<span className={'wifi__status_indicator ' + (netStatus ? 'wifi__status_indicator-success' : 'wifi__status_indicator-danger') }></span></div>
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