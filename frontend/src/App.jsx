import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

// A simple component to handle root redirection
const Root = () => {
  const { token } = React.useContext(AuthContext);
  // If authenticated, go to dashboard, otherwise to login
  return <Navigate to={token ? "/dashboard" : "/login"} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="app-container">
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route index element={<DashboardPage />} />
              {/* Add other protected routes here, e.g., task details */}
            </Route>

            {/* Fallback route for any other path */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
