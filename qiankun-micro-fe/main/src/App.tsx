import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import './App.css';
import { shared } from './index';

const App: React.FC = () => {
  // 定义消息状态
  const [message, setMessage] = useState<string>('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  useEffect(() => {
    console.log('[主应用] 开始监听消息事件');
    
    // 监听子应用发送的消息
    const unsubscribe = shared.on('message', (data: string) => {
      console.log('[主应用] 收到消息:', data);
      setReceivedMessages(prev => [...prev, data]);
    });

    return () => {
      // 组件卸载时取消订阅
      console.log('[主应用] 取消消息事件监听');
      unsubscribe();
    };
  }, []);

  // 发送消息给子应用
  const sendMessage = () => {
    if (message) {
      console.log('[主应用] 发送消息给子应用:', message);
      shared.emit('fromMain', message);
      setMessage('');
    }
  };

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
        <div className="communication-panel">
          <div className="received-messages">
            <h3>收到的消息:</h3>
            {receivedMessages.length > 0 ? (
              <ul>
                {receivedMessages.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            ) : (
              <p>暂无消息</p>
            )}
          </div>
          
          <div className="send-message">
            <input 
              type="text" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="输入发送给子应用的消息" 
            />
            <button onClick={sendMessage}>发送消息</button>
          </div>
        </div>
        
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