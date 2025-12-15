import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Landing from './pages/Landing';
import CustomerApp from './pages/CustomerApp';
import AdminApp from './pages/AdminApp';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Main Landing / Simulator */}
          <Route path="/" element={<Landing />} />
          
          {/* Customer View: Scanned QR for Table X */}
          <Route path="/table/:tableId" element={<CustomerApp />} />
          
          {/* Admin View */}
          <Route path="/admin" element={<AdminApp />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
