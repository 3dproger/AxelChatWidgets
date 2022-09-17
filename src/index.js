import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AxelChat } from './components/AxelChat';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AxelChat />
  </React.StrictMode>
);
