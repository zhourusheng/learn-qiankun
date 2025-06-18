import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { registerMicroApps, start } from 'qiankun';
import './index.css';

// 注册微应用
registerMicroApps([
  {
    name: 'sub-app1',
    entry: '//localhost:8001',
    container: '#sub-app-container',
    activeRule: '/sub-app1',
  },
  {
    name: 'sub-app2',
    entry: '//localhost:8002',
    container: '#sub-app-container',
    activeRule: '/sub-app2',
  },
]);

// 启动qiankun
start();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
); 