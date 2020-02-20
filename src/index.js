import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Pomodoro from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Pomodoro />, document.getElementById('root'));

serviceWorker.unregister();
