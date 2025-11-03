import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { RootView } from './RootView';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <BrowserRouter>
        <RootView />
    </BrowserRouter>
);
