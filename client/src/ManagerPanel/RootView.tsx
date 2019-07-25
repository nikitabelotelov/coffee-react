import {NavLink} from "react-router-dom";
import * as React from "react";

export function RootView(props: any) {
    return (
        <div className='manager-panel__root panel_root'>
            <div className='manager-panel__block btn-outline-dark manager-panel__topleft '>
                <b>Группа 1</b><br/>
                Температура: {props.machineState.group1.temperature} C / {props.settingsState.g1TSet} C<br/>
            </div>
            <div className='manager-panel__block btn-outline-dark manager-panel__topright'>
                <b>Группа 1</b><br/>
                Температура: {props.machineState.group2.temperature} C / {props.settingsState.g2TSet} C<br/>
            </div>
            <div className='manager-panel__block btn-outline-dark manager-panel__middleleft'>
                <b>Преднагревательный</b><br/>
                Температура: {props.machineState.predictGroup.temperature} C / unknown C
            </div>
            <div className='manager-panel__block btn-outline-dark manager-panel__bottomleft'>
                <b>Паровой</b><br />
                Давление: {props.machineState.steam.power/1000} / {props.settingsState.parTSet/1000}
            </div>
            <NavLink to='/settings' className='manager-panel__block btn-outline-dark manager-panel__bottomright'>
                Настройки
            </NavLink>
        </div>
    );
}