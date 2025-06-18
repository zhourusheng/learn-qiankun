import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// qiankun子应用必须导出的生命周期函数
let root: ReactDOM.Root | null = null;

// 渲染函数，用于独立运行和被主应用挂载
function render(props: any) {
  const { container } = props || {};
  // 当作为qiankun子应用运行时，container就是主应用分配的容器div
  // 当独立运行时，container是null，直接挂载到index.html中的#root元素
  const targetElement = container ? container.querySelector('#root') : document.querySelector('#root');
  
  root = ReactDOM.createRoot(targetElement as HTMLElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// 当子应用单独运行时，直接调用render函数
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

// 子应用必须导出的三个生命周期函数
export async function bootstrap() {
  console.log('子应用2 bootstrap');
}

export async function mount(props: any) {
  console.log('子应用2 mount', props);
  render(props);
}

export async function unmount(props: any) {
  console.log('子应用2 unmount');
  if (root) {
    root.unmount();
  }
}

// 为了支持qiankun的类型定义
declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
  }
} 