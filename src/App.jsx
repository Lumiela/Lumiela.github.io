import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';
import BusinessPage from './pages/BusinessPage';
import ProductsPage from './pages/ProductsPage';
import CasesPage from './pages/CasesPage';
import SupportPage from './pages/SupportPage';
import './App.css';
import AdminTopNav from './components/AdminTopNav';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { session, loading, handleLogout, isAdmin } = useAuth();
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith('/admin');

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAdminPage) {
    return (
      <Routes>
        <Route path="/admin" element={session ? <AdminDashboardPage /> : <AdminLoginPage />} />
      </Routes>
    );
  }

  return (
    <div className={`App ${isAdmin ? 'admin-logged-in' : ''}`}>
      {isAdmin && <AdminTopNav />}
      <Header isAdmin={isAdmin} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/about/vision" />} />
          <Route path="/about/*" element={<AboutPage />} />
          <Route path="/business/*" element={<BusinessPage />} />
          <Route path="/products/*" element={<ProductsPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/support/*" element={<SupportPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;