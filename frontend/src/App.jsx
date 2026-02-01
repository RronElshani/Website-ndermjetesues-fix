import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import ServiceDetail from './pages/ServiceDetail';
import Profile from './pages/Profile';
import CreateService from './pages/CreateService';
import MyServices from './pages/MyServices';
import AdminDashboard from './pages/AdminDashboard';
import Messages from './pages/Messages';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
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
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
