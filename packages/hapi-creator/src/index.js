import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/main/App';
import './index.css';

console.log(`Copyright (c) ${new Date().getFullYear()} Amir Kedem, Daniel Peretz and Boaz Katz
https://github.com/1ZouLTReX1/iFigures
${process.env.NODE_ENV} environment
`)

// Load from last auto save if exists
const lastSaveStr = localStorage.getItem('creator-last-save');
let lastSave;
if (lastSaveStr) {
  try {
    lastSave = JSON.parse(lastSaveStr);
  } catch {}
}

ReactDOM.render(
  <React.StrictMode>
    <App initial={lastSave} />
  </React.StrictMode>,
  document.getElementById('root')
);
