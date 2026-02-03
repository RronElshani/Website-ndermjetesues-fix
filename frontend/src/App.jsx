import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const CreateService = lazy(() => import('./pages/CreateService'));
const MyServices = lazy(() => import('./pages/MyServices'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Messages = lazy(() => import('./pages/Messages'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Duke ngarkuar...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/services/:id" element={<ServiceDetail />} />

                {/* Protected Routes - Any authenticated user */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />
                <Route path="/messages/:userId" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />

                {/* Protected Routes - Professionals only */}
                <Route path="/services/create" element={
                  <ProtectedRoute allowedRoles={['profesionist']}>
                    <CreateService />
                  </ProtectedRoute>
                } />
                <Route path="/my-services" element={
                  <ProtectedRoute allowedRoles={['profesionist']}>
                    <MyServices />
                  </ProtectedRoute>
                } />

                {/* Protected Routes - Admin only */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
