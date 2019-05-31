import * as React from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import './Panel.css';
import { Route } from 'react-router-dom';
import Root from './Root';
import SettingsIndex  from './SettingsIndex';
import Profile from './Profile';
import Update from './Update';
import ParametersSettings from './ParametersSettings';
import Steam from './Parameters/Steam'

export class Panel extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Route exact path='*/manage' component={Root} />
                <Route exact path='*/manage/settings' component={SettingsIndex} />
                <Route exact path='*/manage/settings/profile' component={Profile} />
                <Route exact path='*/manage/settings/update' component={Update} />
                <Route exact path='*/manage/settings/profile/hand' component={ParametersSettings} />
                <Route exact path='*/manage/settings/profile/hand/steam' component={Steam} />
            </React.Fragment>
        )
    }
}
