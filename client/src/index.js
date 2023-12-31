import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RouteSwitch from "./RouteSwitch";
import reportWebVitals from './reportWebVitals';
import {CharacterProvider} from "./contextProviders/CharacterContext";
import { AuthProvider } from "./contextProviders/AuthContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
        <CharacterProvider>
            <RouteSwitch />
        </CharacterProvider>
    </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
