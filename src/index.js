import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { CoreView } from './CoreView';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
  <Router><CoreView /></Router>
    
  //</React.StrictMode>
);
