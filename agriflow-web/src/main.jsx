import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import App from './App';
import AppProvider from './app/providers/AppProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode >
        <AppProvider>
            <App />
        </AppProvider>
    </React.StrictMode>
);