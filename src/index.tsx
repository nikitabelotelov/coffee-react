import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.less';
import App from './App';
import store from "./SettingsStore";

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('main'));
