import React, { useEffect, useState } from 'react';
import './App.css';
import CommunicationDemo from './CommunicationDemo';

// 定义Props类型
interface AppProps {
  shared?: any;
}

const App: React.FC<AppProps> = ({ shared }) => {
  const [message, setMessage] = useState<string>('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [showDemo, setShowDemo] = useState<boolean>(false);

  useEffect(() => {
    // 确保shared对象存在
    if (!shared) {
      console.warn('[子应用1] 警告: shared对象未定义，通信功能将不可用');
      return;
    }

    console.log('[子应用1] 开始监听消息事件');
    
    // 订阅从主应用发送过来的消息
    const unsubFromMain = shared.on('fromMain', (data: string) => {
      console.log('[子应用1] 收到主应用消息:', data);
      setReceivedMessages(prev => [...prev, `主应用: ${data}`]);
    });

    // 订阅从其他子应用发送的消息
    const unsubFromSub2 = shared.on('fromSubApp2', (data: string) => {
      console.log('[子应用1] 收到子应用2消息:', data);
      setReceivedMessages(prev => [...prev, `子应用2: ${data}`]);
    });

    return () => {
      // 组件卸载时取消订阅
      console.log('[子应用1] 取消消息事件监听');
      unsubFromMain();
      unsubFromSub2();
    };
  }, [shared]);

  // 发送消息给主应用
  const sendToMain = () => {
    if (!shared) {
      console.warn('[子应用1] 无法发送消息: shared对象未定义');
      return;
    }
    
    if (message) {
      console.log('[子应用1] 发送消息给主应用:', message);
      shared.emit('message', `[子应用1] ${message}`);
      setMessage('');
    }
  };

  // 发送消息给子应用2
  const sendToSubApp2 = () => {
    if (!shared) {
      console.warn('[子应用1] 无法发送消息: shared对象未定义');
      return;
    }
    
    if (message) {
      console.log('[子应用1] 发送消息给子应用2:', message);
      shared.emit('fromSubApp1', message);
      setMessage('');
    }
  };

  // 切换演示组件显示
  const toggleDemo = () => {
    setShowDemo(!showDemo);
  };

  return (
    <div className="sub-app">
      <header className="sub-app-header">
        <h1>子应用1</h1>
        {!shared && <div className="warning-banner">通信功能不可用 - shared对象未定义</div>}
      </header>
      <div className="sub-app-content">
        <div className="app-controls">
          <button 
            onClick={toggleDemo}
            className="toggle-demo-btn"
          >
            {showDemo ? '显示基础应用' : '显示通信演示'}
          </button>
        </div>

        {showDemo ? (
          <CommunicationDemo shared={shared} />
        ) : (
          <>
            <h2>这是子应用1的内容</h2>
            
            <div className="communication-container">
              <div className="message-input">
                <input 
                  type="text" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="输入消息" 
                  disabled={!shared}
                />
                <div className="button-group">
                  <button onClick={sendToMain} disabled={!shared}>发送给主应用</button>
                  <button onClick={sendToSubApp2} disabled={!shared}>发送给子应用2</button>
                </div>
              </div>

              <div className="message-history">
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
            </div>

            <div className="feature-box">
              <h3>子应用1的特点</h3>
              <ul>
                <li>使用React框架</li>
                <li>通过qiankun与主应用通信</li>
                <li>可以独立开发、测试和部署</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
