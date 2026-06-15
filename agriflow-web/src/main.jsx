import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/app.css";
import App from './App';
import AppProvider from './app/providers/AppProvider';
import store from './app/store';
import { injectStore } from './api/axiosClient';

// Inject the Redux store into axiosClient AFTER all modules are initialized.
// This breaks the circular dependency:
//   authSlice → authThunks → axiosClient → (would import store → authSlice → LOOP)
// By calling injectStore here (in main.jsx, after everything is loaded),
// axiosClient never needs to import store at the top level.
injectStore(store);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AppProvider>
            <App />
        </AppProvider>
    </React.StrictMode>
);