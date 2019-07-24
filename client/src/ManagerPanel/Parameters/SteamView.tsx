import {NavLink} from "react-router-dom";
import * as React from "react";
import {getBackLink, ISettingsState} from "../../types";
import NumberInput from "./NumberInput";
import settingStore from "../../SettingsStore/index";
import {setSetting} from "../../actions/index";

interface ISteamView {
    settingsState: ISettingsState
}

export default class SteamView extends React.Component<ISteamView> {
    incrementHandler() {
        settingStore.dispatch(setSetting({
            settingName: "parTSet",
            settingValue: this.props.settingsState.parTSet + 1
        }));
    };

    decrementHandler() {
        settingStore.dispatch(setSetting({
            settingName: "parTSet",
            settingValue: this.props.settingsState.parTSet - 1
        }));
    };

    render() {
        return (
            <div className='setting__profile-parameters panel_root'>
                <div className='manager-panel__block manager-panel__top'>
                    <p>Давление парового бойлера</p>
                    <NumberInput increment={this.incrementHandler.bind(this)}
                                 decrement={this.decrementHandler.bind(this)} value={this.props.settingsState.parTSet
                    / 1000}/>
                </div>
                <NavLink to={getBackLink()} className='manager-panel__block manager-panel__bottom'>
                    Назад
                </NavLink>
            </div>
        );
    };
}