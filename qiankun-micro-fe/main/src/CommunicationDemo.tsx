import React, { useState, useEffect } from 'react';
import { shared } from './index';

const CommunicationDemo: React.FC = () => {
  const [messageText, setMessageText] = useState('');
  const [eventName, setEventName] = useState('customEvent');
  const [receivedEvents, setReceivedEvents] = useState<Array<{ event: string, data: any, timestamp: number }>>([]);
  const [globalData, setGlobalData] = useState<any>(shared.state);
  
  // 初始化时订阅全局事件
  useEffect(() => {
    // 通用事件监听器，监听所有事件
    const eventHandler = (event: string) => (data: any) => {
      console.log(`[主应用] 收到事件 ${event}:`, data);
      addEventToHistory(event, data);
    };

    // 监听所有通信相关事件
    const listeners: [string, (data: any) => void][] = [
      ['customEvent', eventHandler('customEvent')],
      ['broadcast', eventHandler('broadcast')], 
      ['fromSubApp1', eventHandler('fromSubApp1')],
      ['fromSubApp2', eventHandler('fromSubApp2')],
      ['message', eventHandler('message')]
    ];
    
    // 注册所有监听器
    const unsubscribers = listeners.map(([event, handler]) => 
      shared.on(event, handler)
    );
    
    // 监听全局状态变化
    const unsubGlobalState = shared.on('globalStateChange', (newState: any, oldState: any) => {
      console.log('[主应用] 全局状态变化:', newState, oldState);
      setGlobalData(newState);
      addEventToHistory('globalStateChange', { newState, oldState });
    });
    
    return () => {
      // 清理所有事件订阅
      unsubscribers.forEach(unsub => unsub());
      unsubGlobalState();
    };
  }, []);
  
  // 添加事件到历史记录
  const addEventToHistory = (event: string, data: any) => {
    setReceivedEvents(prev => [
      { event, data, timestamp: Date.now() },
      ...prev.slice(0, 19) // 主应用记录更多历史
    ]);
  };
  
  // 发送自定义事件
  const sendCustomEvent = () => {
    if (!messageText) return;
    
    shared.emit(eventName, {
      from: '主应用',
      message: messageText,
      timestamp: new Date().toLocaleTimeString()
    });
    
    console.log(`[主应用] 发送自定义事件 "${eventName}":`, messageText);
    setMessageText('');
  };
  
  // 发送广播消息
  const sendBroadcast = () => {
    if (!messageText) return;
    
    shared.emit('broadcast', {
      from: '主应用',
      message: messageText,
      timestamp: new Date().toLocaleTimeString()
    });
    
    console.log('[主应用] 发送广播消息:', messageText);
    setMessageText('');
  };
  
  // 发送消息到特定应用
  const sendToSubApp = (appName: string, eventName: string) => {
    if (!messageText) return;
    
    shared.emit(eventName, {
      from: '主应用',
      to: appName,
      message: messageText,
      timestamp: new Date().toLocaleTimeString()
    });
    
    console.log(`[主应用] 发送消息到${appName}:`, messageText);
    setMessageText('');
  };
  
  // 更新全局状态
  const updateGlobalState = () => {
    if (!messageText) return;
    
    shared.setGlobalState({
      globalData: {
        ...shared.state.globalData,
        lastUpdate: {
          from: '主应用',
          message: messageText,
          timestamp: new Date().toLocaleTimeString()
        }
      }
    });
    
    console.log('[主应用] 更新全局状态:', messageText);
    setMessageText('');
  };

  return (
    <div className="main-communication-demo">
      <h2>通信演示 - 主应用</h2>
      
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
          
          {/* 发送到特定应用 */}
          <div className="button-row">
            <button 
              onClick={() => sendToSubApp('子应用1', 'fromMain')}
              disabled={!messageText}>
              发送到子应用1
            </button>
            <button 
              onClick={() => sendToSubApp('子应用2', 'fromMain')}
              disabled={!messageText}>
              发送到子应用2
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
      
      <div className="communication-docs">
        <h3>通信方式说明</h3>
        <ul>
          <li>
            <strong>自定义事件</strong> - 通过shared.emit和shared.on实现发布-订阅模式
          </li>
          <li>
            <strong>广播消息</strong> - 通过特定的broadcast事件，所有应用都可以监听
          </li>
          <li>
            <strong>状态共享</strong> - 通过shared.setGlobalState更新全局状态，所有应用通过globalStateChange事件监听变化
          </li>
          <li>
            <strong>点对点通信</strong> - 使用特定的事件名称，如fromMain, fromSubApp1对特定应用发送消息
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CommunicationDemo; 