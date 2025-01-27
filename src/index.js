import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { RootView } from './RootView';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <RootView />
  </Router>
);
