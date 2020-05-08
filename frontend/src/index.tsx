import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.scss';
import App from './App/App';
import ReactModal from 'react-modal';
import * as serviceWorker from './serviceWorker';
import { HashRouter as Router } from 'react-router-dom';

ReactModal.setAppElement('#root');

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);

serviceWorker.unregister();
