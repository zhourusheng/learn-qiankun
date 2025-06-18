import React from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-main">
      <header className="app-header">
        <h1>QianKun主应用</h1>
        <div className="menu-container">
          <Link to="/" className="menu-item">首页</Link>
          <Link to="/sub-app1" className="menu-item">子应用1</Link>
          <Link to="/sub-app2" className="menu-item">子应用2</Link>
        </div>
      </header>
      
      <div className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sub-app1/*" element={<div id="sub-app-container"></div>} />
          <Route path="/sub-app2/*" element={<div id="sub-app-container"></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App; 