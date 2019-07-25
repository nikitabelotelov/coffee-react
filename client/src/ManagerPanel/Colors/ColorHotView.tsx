import {NavLink} from "react-router-dom";
import * as React from "react";
import {getBackLink, ISettingsState} from "../../types";
import NumberInput from "../NumberInput";
import settingStore from "../../SettingsStore/index";
import {setSetting} from "../../actions/index";

interface IColorView {
    settingsState: ISettingsState
}

export default class ColorHotView extends React.Component<IColorView> {
    changeValueHandler(colorName: string, value: number) {
        settingStore.dispatch(setSetting({
            settingName: colorName,
            settingValue: value
        }));
    };


    render() {
        return (
            <div className='setting__profile-parameters panel_root'>
                <div className='manager-panel__block manager-panel__top'>
                    <p>Красный(нагретая машина)</p>
                    <NumberInput increment={this.changeValueHandler.bind(this,
                                    'rHot',
                                    this.props.settingsState.rHot + 1)}
                                 decrement={this.changeValueHandler.bind(this,
                                     'rHot',
                                     this.props.settingsState.rHot - 1)}
                                 value={this.props.settingsState.rHot}/>
                    <p>Зеленый(нагретая машина)</p>
                    <NumberInput increment={this.changeValueHandler.bind(this,
                        'gHot',
                        this.props.settingsState.gHot + 1)}
                                 decrement={this.changeValueHandler.bind(this,
                                     'gHot',
                                     this.props.settingsState.gHot - 1)}
                                 value={this.props.settingsState.gHot}/>
                    <p>Синий(нагретая машина)</p>
                    <NumberInput increment={this.changeValueHandler.bind(this,
                        'bHot',
                        this.props.settingsState.bHot + 1)}
                                 decrement={this.changeValueHandler.bind(this,
                                     'bHot',
                                     this.props.settingsState.bHot - 1)}
                                 value={this.props.settingsState.bHot}/>
                </div>
                <NavLink to={getBackLink()} className='manager-panel__block manager-panel__bottom'>
                    Назад
                </NavLink>
            </div>
        );
    };
}