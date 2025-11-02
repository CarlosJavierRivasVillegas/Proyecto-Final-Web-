import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded pages (code-splitting)
const Home = React.lazy(() => import('./pages/Home'));
const NewsDetail = React.lazy(() => import('./pages/NewsDetail'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const NewsForm = React.lazy(() => import('./pages/NewsForm'));
const SectionsPage = React.lazy(() => import('./pages/Sections'));

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/noticia/:id" element={<NewsDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/news/new" element={<ProtectedRoute><NewsForm /></ProtectedRoute>} />
            <Route path="/dashboard/news/:id/edit" element={<ProtectedRoute><NewsForm /></ProtectedRoute>} />
            <Route path="/dashboard/sections" element={<ProtectedRoute><SectionsPage /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
