export class WebSocketManager {
  constructor(url, options = {}) {
    // 配置参数
    this.url = url;
    this.options = {
      reconnectLimit: options.reconnectLimit || 3, // 最大重连次数
      reconnectInterval: options.reconnectInterval || 30000, // 重连间隔
      heartInterval: options.heartInterval || 20000, // 心跳间隔
      autoReconnect: options.autoReconnect ?? true, // 是否自动重连
      ...options
    };

    // 状态管理
    this.ws = null;
    this.reconnectCount = 0;
    this.isManualClose = false; // 是否主动关闭
    this.messageQueue = []; // 消息队列
    this.eventListeners = {}; // 事件监听器
    this.timers = { heartTimer: null, reconnectTimer: null };

    // 自动初始化连接
    this.connect();
  }

  // 创建WebSocket连接
  connect() {
    this.ws = new WebSocket(this.url);
    this.bindEvents();
  }

  // 绑定事件
  bindEvents() {
    this.ws.onopen = (event) => {
      this.triggerEvent('open', event);
      this.resetReconnect();
      this.startHeartbeat();
      this.processMessageQueue();
    };

    this.ws.onmessage = (event) => {
      this.triggerEvent('message', event);
      this.handleMessage(event.data);
    };

    this.ws.onerror = (error) => {
      this.triggerEvent('error', error);
      this.reconnect();
    };

    this.ws.onclose = (event) => {
      this.triggerEvent('close', event);
      if (!this.isManualClose) this.reconnect();
    };
  }

  // 处理接收消息
  handleMessage(data) {
    try {
      // 自动解析JSON格式消息
      const parsedData = JSON.parse(data);
      this.triggerEvent('parsed-message', parsedData);
    } catch (e) {
      this.triggerEvent('raw-message', data);
    }
  }

  // 发送消息
  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      const payload = typeof data === 'object' ? JSON.stringify(data) : data;
      this.ws.send(payload);
    } else {
      this.messageQueue.push(data);
    }
  }

  // 关闭连接
  close() {
    this.isManualClose = true;
    this.clearTimers();
    this.ws.close();
  }

  // 重连机制
  reconnect() {
    if (!this.options.autoReconnect) return;
    if (this.reconnectCount >= this.options.reconnectLimit) return;

    this.clearTimers();

    this.timers.reconnectTimer = setTimeout(() => {
      this.reconnectCount++;
      this.connect();
    }, this.options.reconnectInterval);
  }

  // 重置重连状态
  resetReconnect() {
    this.reconnectCount = 0;
    this.isManualClose = false;
  }

  // 处理消息队列
  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  // 心跳检测
  startHeartbeat() {
    this.timers.heartTimer = setInterval(() => {
      this.send('{"type":"heartbeat"}');
    }, this.options.heartInterval);
  }

  // 事件管理
  addEventListener(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  removeEventListener(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter((cb) => cb !== callback);
    }
  }

  triggerEvent(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach((cb) => cb(data));
    }
  }

  // 清理定时器
  clearTimers() {
    clearInterval(this.timers.heartTimer);
    clearTimeout(this.timers.reconnectTimer);
  }

  // 状态判断
  get readyState() {
    return this.ws.readyState;
  }
}
//
// // 使用示例
// const wsManager = new WebSocketManager('wss://your-websocket-url', {
//   reconnectLimit: 5,
//   heartInterval: 10000
// });
//
// // 添加事件监听
// wsManager.addEventListener('open', (event) => {
//   console.log('WebSocket connected');
// });
//
// wsManager.addEventListener('parsed-message', (data) => {
//   console.log('Received parsed message:', data);
// });
//
// wsManager.addEventListener('error', (error) => {
//   console.error('WebSocket error:', error);
// });
//
// // 发送消息
// wsManager.send({ type: 'chat', content: 'Hello' });
//
// // 关闭连接
// // wsManager.close();
