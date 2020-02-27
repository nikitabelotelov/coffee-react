import { NavLink } from "react-router-dom";
import React, { useState, useRef, useEffect } from 'react';
import { getBackLink, IWifiNet, WIFI_STATUS } from "../types";
import { IAppState } from "../reducers";
import settingsStore, { emitWifiListUpdate } from "../SettingsStore"
import { connect } from "react-redux";
import { connectWifiNet } from "../actions";
import { checkConnection } from "../actions/NetChecker";
import { Input } from "./WIfi/Input";
import './WIfi/WifiPanel.less';

export function WifiView(opts: IAppState) {
    const [choosenNetwork, setChoosenNetwork] = useState(null)
    const [netStatus, setNetStatus] = useState(false)
    const [pass, setPass] = useState('')
    let interval: number
    useEffect(() => {
        checkConnection().then((res) => {
            setNetStatus(res)
        })
        interval = window.setInterval(() => {
            checkConnection().then((res) => {
                setNetStatus(res)
            })
            emitWifiListUpdate();
        }, 5000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <div className='wifi__root'>
            <ul className='wifiPanel__list'>
                {opts.availableWifiNets.map((el, key) => {
                    return (<li className={'list-group-item' + (el.ssid === choosenNetwork ? ' list-group-item__selected' : '')} onClick={() => {
                        setChoosenNetwork(el.ssid)
                    }} key={key}>{el.ssid} {(opts.wifiStatus.wifiStatus === WIFI_STATUS.CONNECTED && el.ssid === opts.wifiStatus.currentWifiNet.ssid) ? "*" : ''}
                        {(opts.wifiStatus.wifiStatus === WIFI_STATUS.CONNECTING && el.ssid === opts.wifiStatus.currentWifiNet.ssid) ? "CONNECTING" : ''}</li>)
                })}
            </ul>
            <div className="wifiPanel__controls">
                <div onClick={() => {
                    if (choosenNetwork) {
                        settingsStore.dispatch(connectWifiNet({ ssid: choosenNetwork, password: pass }))
                    }
                }} className='manager-panel__block manager-panel__topright wifiPanel__controls_button'>
                    Подключиться
                </div>
                <Input className="wifi__password" value={pass} onChange={setPass} placeholder="введите пароль" />
                <div className="wifi__status">Статус сети: <span className={'wifi__status_indicator ' + (netStatus ? 'wifi__status_indicator-success' : 'wifi__status_indicator-danger')}></span></div>
                <NavLink to={getBackLink()} className='manager-panel__block manager-panel__bottomright wifiPanel__controls_button'>
                    Назад
            </NavLink>
            </div>
        </div>
    );
}


const mapStateToProps = (state: IAppState) => {
    return { ...state };
}

export const Wifi = connect(mapStateToProps)(WifiView);