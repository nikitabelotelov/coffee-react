import {NavLink} from "react-router-dom";
import * as React from "react";

export function RootView(props: any) {
    return (
        <div className='manager-panel__root panel_root'>
            <div className='manager-panel__block btn-outline-dark manager-panel__topleft '>
                <b>Группа 1</b><br/>
                Температура: {props.machineState.group1.temperature} C / {props.machineState.group1.setting.temperature} C<br/>
                Пролив: {props.machineState.group1.setting.value} ml
            </div>
            <div className='manager-panel__block btn-outline-dark manager-panel__topright'>
                <b>Группа 1</b><br/>
                Температура: {props.machineState.group2.temperature} C / {props.machineState.group2.setting.temperature} C<br/>
                Пролив: {props.machineState.group2.setting.value} ml
            </div>
            <div className='manager-panel__block btn-outline-dark manager-panel__middleleft'>
                <b>Преднагревательный</b><br/>
                Температура: {props.machineState.predictGroup.temperature} C / {props.machineState.predictGroup.setting.temperature} C
            </div>
            <div className='manager-panel__block btn-outline-dark manager-panel__bottomleft'>
                <b>Паровой</b><br />
                Давление: {props.machineState.steam.power/1000} / {props.machineState.steam.setting.power/1000}
            </div>
            <NavLink to='manage/settings' className='manager-panel__block btn-outline-dark manager-panel__bottomright'>
                Настройки
            </NavLink>
        </div>
    );
}