import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './components/App/Auth/Auth';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
