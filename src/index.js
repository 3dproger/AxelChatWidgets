import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { WebSocketWrapper } from './WebSocketWrapper';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WebSocketWrapper />
  </React.StrictMode>
);
