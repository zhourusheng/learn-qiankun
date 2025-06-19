import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 存储共享对象的引用
let sharedProps: any = null;

// qiankun子应用必须导出的生命周期函数
let root: ReactDOM.Root | null = null;

// 渲染函数，用于独立运行和被主应用挂载
function render(props: any) {
  const { container, shared } = props || {};
  
  // 当接收到主应用传递的shared对象时，保存起来供子应用使用
  if (shared) {
    sharedProps = shared;
    // 导出到全局，方便在其他组件中使用
    window.sharedProps = shared;
    console.log('[子应用1] 接收到shared对象:', shared);
  }
  
  // 当作为qiankun子应用运行时，container就是主应用分配的容器div
  // 当独立运行时，container是null，直接挂载到index.html中的#root元素
  const targetElement = container ? container.querySelector('#root') : document.querySelector('#root');
  
  if (!targetElement) {
    console.error('[子应用1] 无法找到挂载点');
    return;
  }
  
  root = ReactDOM.createRoot(targetElement as HTMLElement);
  
  root.render(
    <React.StrictMode>
      <App shared={sharedProps} />
    </React.StrictMode>
  );
}

// 当子应用单独运行时，直接调用render函数
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

// 子应用必须导出的三个生命周期函数
export async function bootstrap() {
  console.log('[子应用1] bootstrap');
}

export async function mount(props: any) {
  console.log('[子应用1] mount，接收到的props:', props);
  render(props);
}

export async function unmount(props: any) {
  console.log('[子应用1] unmount');
  if (root) {
    root.unmount();
  }
  // 清理事件监听等资源
  if (sharedProps) {
    // 可以在这里取消所有订阅，但目前由各组件自行取消
    console.log('[子应用1] 卸载，清理资源');
  }
}

// 为了支持qiankun的类型定义
declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    sharedProps: any; // 添加对共享对象的全局引用
  }
} 