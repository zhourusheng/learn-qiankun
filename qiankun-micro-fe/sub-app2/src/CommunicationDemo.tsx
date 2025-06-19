import React, { useState, useEffect } from 'react';

interface CommunicationDemoProps {
  shared: any;
}

// 通信演示组件
const CommunicationDemo: React.FC<CommunicationDemoProps> = ({ shared }) => {
  const [messageText, setMessageText] = useState('');
  const [eventName, setEventName] = useState('customEvent');
  const [receivedEvents, setReceivedEvents] = useState<Array<{ event: string, data: any, timestamp: number }>>([]);
  const [globalData, setGlobalData] = useState<any>(null);
  
  // 初始化时订阅全局事件
  useEffect(() => {
    if (!shared) return;
    
    // 监听所有自定义事件
    const unsubCustomEvents = shared.on('customEvent', (data: any) => {
      console.log('[子应用2] 收到自定义事件:', data);
      addEventToHistory('customEvent', data);
    });
    
    // 监听广播事件
    const unsubBroadcast = shared.on('broadcast', (data: any) => {
      console.log('[子应用2] 收到广播消息:', data);
      addEventToHistory('broadcast', data);
    });
    
    // 监听全局状态变化
    const unsubGlobalState = shared.on('globalStateChange', (newState: any, oldState: any) => {
      console.log('[子应用2] 全局状态变化:', newState, oldState);
      setGlobalData(newState);
      addEventToHistory('globalStateChange', { newState, oldState });
    });
    
    // 初始化全局状态显示
    setGlobalData(shared.state);
    
    return () => {
      // 清理订阅
      unsubCustomEvents();
      unsubBroadcast();
      unsubGlobalState();
    };
  }, [shared]);
  
  // 添加事件到历史记录
  const addEventToHistory = (event: string, data: any) => {
    setReceivedEvents(prev => [
      { event, data, timestamp: Date.now() },
      ...prev.slice(0, 9) // 只保留最近的10条记录
    ]);
  };
  
  // 发送自定义事件
  const sendCustomEvent = () => {
    if (!shared || !messageText) return;
    
    shared.emit(eventName, {
      from: '子应用2',
      message: messageText,
      timestamp: new Date().toLocaleTimeString()
    });
    
    console.log(`[子应用2] 发送自定义事件 "${eventName}":`, messageText);
    setMessageText('');
  };
  
  // 发送广播消息
  const sendBroadcast = () => {
    if (!shared || !messageText) return;
    
    shared.emit('broadcast', {
      from: '子应用2',
      message: messageText,
      timestamp: new Date().toLocaleTimeString()
    });
    
    console.log('[子应用2] 发送广播消息:', messageText);
    setMessageText('');
  };
  
  // 更新全局状态
  const updateGlobalState = () => {
    if (!shared || !messageText) return;
    
    shared.setGlobalState({
      globalData: {
        ...shared.state.globalData,
        lastUpdate: {
          from: '子应用2',
          message: messageText,
          timestamp: new Date().toLocaleTimeString()
        }
      }
    });
    
    console.log('[子应用2] 更新全局状态:', messageText);
    setMessageText('');
  };

  return (
    <div className="communication-demo">
      <h2>通信演示 - 子应用2</h2>
      
      <div className="demo-section">
        <h3>发送消息</h3>
        
        <div className="input-group">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="输入消息内容" 
            className="text-input"
          />
          
          {/* 自定义事件发送 */}
          <div className="custom-event-group">
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="事件名称"
              className="event-input"
            />
            <button onClick={sendCustomEvent} disabled={!messageText}>
              发送自定义事件
            </button>
          </div>
          
          {/* 广播和全局状态更新 */}
          <div className="button-row">
            <button onClick={sendBroadcast} disabled={!messageText}>
              广播消息
            </button>
            <button onClick={updateGlobalState} disabled={!messageText}>
              更新全局状态
            </button>
          </div>
        </div>
      </div>
      
      <div className="display-section">
        <div className="global-state">
          <h3>全局状态</h3>
          <pre>{JSON.stringify(globalData, null, 2)}</pre>
        </div>
        
        <div className="events-history">
          <h3>事件历史</h3>
          {receivedEvents.length > 0 ? (
            <ul className="events-list">
              {receivedEvents.map((item, index) => (
                <li key={index} className={`event-item ${item.event}`}>
                  <div className="event-header">
                    <span className="event-type">{item.event}</span>
                    <span className="event-time">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="event-data">{JSON.stringify(item.data, null, 2)}</pre>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-events">暂无事件记录</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationDemo; 