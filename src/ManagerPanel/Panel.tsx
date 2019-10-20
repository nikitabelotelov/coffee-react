import * as React from "react";

import "./Panel.less";
import { Route } from "react-router-dom";
import Root from "./Root";
import SettingsIndex from "./SettingsIndex";
import Profile from "./Profile";
import Update from "./Update";
import ParametersSettings from "./ParametersSettings";
import Steam from "./Parameters/Steam";
import ColorHot from "./Colors/ColorHot";

export class Panel extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Route exact path="/" component={Root} />
        <Route exact path="*/settings" component={SettingsIndex} />
        <Route exact path="*/settings/profile" component={Profile} />
        <Route exact path="*/settings/color" component={ColorHot} />
        <Route exact path="*/settings/update" component={Update} />
        <Route
          exact
          path="*/settings/profile/hand"
          component={ParametersSettings}
        />
        <Route exact path="*/settings/profile/hand/steam" component={Steam} />
      </React.Fragment>
    );
  }
}
