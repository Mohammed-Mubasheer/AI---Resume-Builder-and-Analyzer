// frontend/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'antd/dist/reset.css';
import { Layout } from 'antd';
import { AuthProvider } from './context/AuthContext';

// Import our pages and components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import BuilderPage from './pages/BuilderPage';
import AnalyzerPage from './pages/AnalyzerPage'; // Ensure this import is correct

const { Content } = Layout;

function App() {
  return (
    <AuthProvider>
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Content> {/* Removed the extra padding from here */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/builder"
              element={
                <ProtectedRoute>
                  <BuilderPage />
                </ProtectedRoute>
              }
            />
            {/* MODIFIED: Added the missing Analyzer Route */}
            <Route
              path="/analyzer"
              element={
                <ProtectedRoute>
                  <AnalyzerPage />
                </ProtectedRoute>
              }
            />
            {/* ------------------------------------------- */}

            {/* Optional: Add a 404 Not Found Route */}
            {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
          </Routes>
        </Content>
      </Layout>
    </AuthProvider>
  );
}

export default App;