import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { registerMicroApps, start } from 'qiankun';
import './index.css';

// 定义事件缓存的类型
type EventCallback = (...args: any[]) => void;
type EventCacheType = {
  [eventName: string]: EventCallback[];
};

// 定义共享状态的类型
interface SharedStateType {
  user: any | null;
  globalData: Record<string, any>;
}

// 用于在应用间共享的状态和方法
const shared = {
  // 共享状态
  state: {
    user: null,
    globalData: {}
  } as SharedStateType,
  // 事件缓存
  eventCache: {} as EventCacheType,
  // 设置全局状态的方法
  setGlobalState: (state = {}) => {
    if (state === shared.state) return;
    const oldState = { ...shared.state };
    shared.state = { ...shared.state, ...state };
    // 触发全局状态变化事件
    if (shared.eventCache['globalStateChange']) {
      shared.eventCache['globalStateChange'].forEach(fn => fn(shared.state, oldState));
    }
  },
  // 注册事件
  on: (event: string, callback: EventCallback) => {
    if (!shared.eventCache[event]) {
      shared.eventCache[event] = [];
    }
    shared.eventCache[event].push(callback);
    return () => shared.off(event, callback);
  },
  // 注销事件
  off: (event: string, callback?: EventCallback) => {
    if (shared.eventCache[event]) {
      if (callback) {
        shared.eventCache[event] = shared.eventCache[event].filter(fn => fn !== callback);
      } else {
        shared.eventCache[event] = [];
      }
    }
  },
  // 触发事件
  emit: (event: string, ...args: any[]) => {
    console.log(`[主应用] 发送事件: ${event}`, args);
    if (shared.eventCache[event]) {
      shared.eventCache[event].forEach(fn => {
        try {
          fn(...args);
        } catch (error) {
          console.error(`[主应用] 事件处理错误 (${event}):`, error);
        }
      });
    } else {
      console.warn(`[主应用] 警告: 没有监听器订阅事件 "${event}"`);
    }
  }
};

// 注册微应用
registerMicroApps([
  {
    name: 'sub-app1',
    entry: '//localhost:8001',
    container: '#sub-app-container',
    activeRule: '/sub-app1',
    props: { shared } // 将共享对象传递给子应用
  },
  {
    name: 'sub-app2',
    entry: '//localhost:8002',
    container: '#sub-app-container',
    activeRule: '/sub-app2',
    props: { shared } // 将共享对象传递给子应用
  },
]);

// 启动qiankun
start();

// 导出共享对象，使主应用也能使用
export { shared };

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
); 