import React from 'react';
import ReactDOM from 'react-dom';

import 'normalize.css';
import './style.scss';

import App from './App';

const init = async () => {
  ReactDOM.render(<App />, document.querySelector('#container'));
};

init().catch(e => console.error(e));
