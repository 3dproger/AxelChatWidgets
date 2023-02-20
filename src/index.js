import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { CoreView } from './CoreView';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CoreView />
  </React.StrictMode>
);
