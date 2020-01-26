import * as React from "react";

import "./Panel.less";
import { Route } from "react-router-dom";
import Root from "./Root";
import SettingsIndex from "./SettingsIndex";
import Profile from "./Profile";
import Update from "./Update";
import ParametersSettings from "./ParametersSettings";
import Steam from "./Parameters/Steam";
import GroupTemperature from "./Parameters/GroupTemperature";
import Color from "./Colors/Color";
import Admin from "./Admin";
import PreSoaking from "./Parameters/PreSoaking";
import AutoMode from "./Parameters/AutoMode";
import Predict from "./Parameters/Predict";
import {Wifi} from "./Wifi";

export function Panel() {
    return (
      <React.Fragment>
        <Route exact path="/" component={Root} />
        <Route exact path="*/admin" component={Admin} />
        <Route exact path="*/settings" component={SettingsIndex} />
        <Route exact path="*/settings/profile" component={Profile} />
        <Route exact path="*/settings/color" component={Color} />
        <Route exact path="*/settings/wifi" component={Wifi} />
        <Route exact path="*/settings/update" component={Update} />
        <Route exact path="*/settings/profile/hand" component={ParametersSettings} />
        <Route exact path="*/settings/profile/hand/steam" component={Steam} />
        <Route exact path="*/settings/profile/hand/temp" component={GroupTemperature} />
        <Route exact path="*/settings/profile/hand/soaking" component={PreSoaking} />
        <Route exact path="*/settings/profile/hand/automode" component={AutoMode} />
        <Route exact path="*/settings/profile/hand/predict" component={Predict} />
      </React.Fragment>
    );
}
