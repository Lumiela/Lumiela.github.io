import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { GlobalStyle } from './styles/GlobalStyle.js'; // Import GlobalStyle
import { AuthProvider } from './contexts/AuthContext.jsx';
import 'antd/dist/reset.css'; // Import Ant Design CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalStyle /> {/* Render GlobalStyle */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);