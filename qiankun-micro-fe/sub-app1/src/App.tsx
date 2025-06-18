import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="sub-app">
      <header className="sub-app-header">
        <h1>子应用1</h1>
      </header>
      <div className="sub-app-content">
        <h2>这是子应用1的内容</h2>
        <p>当前应用独立于主应用，可以有自己的路由和状态管理</p>
        <div className="feature-box">
          <h3>子应用1的特点</h3>
          <ul>
            <li>使用React框架</li>
            <li>通过qiankun与主应用通信</li>
            <li>可以独立开发、测试和部署</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
