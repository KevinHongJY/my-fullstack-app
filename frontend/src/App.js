import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

// API 基础 URL - 根据环境自动选择
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://my-fullstack-app-production-9cdc.up.railway.app'  // 生产环境 Railway 地址
  : 'http://localhost:5001';  // 开发环境本地地址

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      console.error('检查认证状态失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      加载中...
    </div>;
  }

  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/dashboard" replace /> : 
                <Login onLogin={handleLogin} apiBaseUrl={API_BASE_URL} />
              } 
            />
            <Route 
              path="/register" 
              element={
                user ? <Navigate to="/dashboard" replace /> : 
                <Register apiBaseUrl={API_BASE_URL} />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                user ? <Dashboard user={user} onLogout={handleLogout} apiBaseUrl={API_BASE_URL} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/" 
              element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
            />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
