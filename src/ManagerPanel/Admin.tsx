import {NavLink} from "react-router-dom";
import * as React from "react";
import {getBackLink} from "../types";
import { IAppState } from "../reducers";
import { connect } from "react-redux";
import { StmMessages } from "../../server/stm/Converter";
import "./Admin.less";

const Admin = (props: IAppState) => {
    const tg1 = Math.round((props.life.tTrendG1.length ? props.life.tTrendG1[props.life.tTrendG1.length - 1].value : 0) * 10)/10
    const tg2 = Math.round((props.life.tTrendG2.length ? props.life.tTrendG2[props.life.tTrendG2.length - 1].value : 0) * 10)/10
    return (
        <div className='setting__root panel_root'>
            <NavLink to='admin/trend' className='manager-panel__block admin__text'>
                Группа 1: P = {props.machine[StmMessages.Group1Pressure]}, T = {tg1} ({props.settings.Group1Temperature})<br />
                Клапан: Valve2 = {props.machine[StmMessages.Valve2]} / valve4 = {props.machine[StmMessages.Valve4]}<br />
                Тен: {props.machine[StmMessages.Relay4]}<br />
                Группа 2: P = {props.machine[StmMessages.Group2Pressure]}, T = {tg2} ({props.settings.Group2Temperature})<br />
                Клапан: Valve3 = {props.machine[StmMessages.Valve3]} / valve5 = {props.machine[StmMessages.Valve5]}<br />
                Тен: {props.machine[StmMessages.Relay6]}
            </NavLink>
            <div className='manager-panel__block admin__text'>
                Давление пара: {props.machine[StmMessages.SteamPressure]} <br />
                Клапан: Valve1 = {props.machine[StmMessages.Valve1]} <br />
                Тен пара: {props.machine[StmMessages.Relay1]} и {props.machine[StmMessages.Relay2]} <br />
                Температура в преднагреве: {props.machine[StmMessages.PredictGroupTemperature]} <br />
                Тен преднагрева: {props.machine[StmMessages.Relay3]}
            </div>
            <div className='manager-panel__block admin__text'>
                <div className='admin__buttons'>
                    <div className={"admin__button" + (props.machine[StmMessages.Button1]==='1' ? " admin__button_active" : "")}>B1</div>
                    <div className={"admin__button" + (props.machine[StmMessages.Button2]==='1' ? " admin__button_active" : "")}>B2</div>
                    <div className={"admin__button" + (props.machine[StmMessages.Button3]==='1' ? " admin__button_active" : "")}>B3</div>
                    <div className={"admin__button" + (props.machine[StmMessages.Button4]==='1' ? " admin__button_active" : "")}>B4</div>
                    <div className={"admin__button" + (props.machine[StmMessages.Button5]==='1' ? " admin__button_active" : "")}>B5</div>
                    <div className={"admin__button" + (props.machine[StmMessages.Button6]==='1' ? " admin__button_active" : "")}>B6</div>
                    <div className={"admin__button" + (props.machine[StmMessages.Button7]==='1' ? " admin__button_active" : "")}>B7</div>
                    <div className={"admin__button" + (props.machine[StmMessages.Button8]==='1' ? " admin__button_active" : "")}>B8</div>
                    <div className={"admin__button" + (props.machine[StmMessages.Button9]==='1' ? " admin__button_active" : "")}>B9</div>
                </div>
                Насос: {props.machine[StmMessages.Relay8]} <br />
                Уровень воды: {props.machine[StmMessages.WaterLevel]}<br />
                Volum1: {props.machine[StmMessages.VolumetricGroup1]}<br />
                Volum2: {props.machine[StmMessages.VolumetricGroup2]}
            </div>
            <NavLink to={getBackLink()} className='manager-panel__block '>
                Назад
            </NavLink>
        </div>
    );
}

const mapStateToProps = (state:IAppState) => {
    return {...state}
};

const AdminConnected = connect(
    mapStateToProps
)(Admin);

export default AdminConnected