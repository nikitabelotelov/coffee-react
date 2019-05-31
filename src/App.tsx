import React, {Component} from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './normalize.css';
import {Panel} from './ManagerPanel/Panel'

class App extends Component {
    render() {
        return (
            <Router>
                <Panel/>
            </Router>
        );
    }
}

export default App;
