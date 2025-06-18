import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="sub-app">
      <header className="sub-app-header">
        <h1>子应用2</h1>
      </header>
      <div className="sub-app-content">
        <h2>这是子应用2的内容</h2>
        <p>当前应用独立于主应用，可以有自己的路由和状态管理</p>
        <div className="feature-box">
          <h3>子应用2的特点</h3>
          <ul>
            <li>使用React框架</li>
            <li>子应用之间状态相互隔离</li>
            <li>可以和其他子应用共存</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App; 