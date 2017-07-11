import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';

window.setTimeout(() => {
  ReactDOM.render(<App />, document.getElementById('root'));
  registerServiceWorker();
}, 500);
