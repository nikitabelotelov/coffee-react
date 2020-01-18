import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.less';
import App from './App';
import store from "./SettingsStore";

// remove context menu
window.addEventListener('contextmenu', (e) => e.preventDefault())

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('main'));
