export type WebSocketStatus = 'connecting' | 'open' | 'closing' | 'closed';

type MessageHandler = (data: any) => void;

class WebSocketService {
  private url: string;
  private socket: WebSocket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private statusChangeHandlers: Set<(status: WebSocketStatus) => void> = new Set();
  private reconnectInterval: number = 3000;
  private maxReconnectAttempts: number = 5;
  private reconnectAttempts: number = 0;
  private manualClose: boolean = false;

  constructor(url: string) {
    this.url = url;
  }

  public connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.manualClose = false;
    this.notifyStatus('connecting');

    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('WebSocket Connected');
        this.notifyStatus('open');
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyHandlers(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.socket.onclose = () => {
        this.notifyStatus('closed');
        if (!this.manualClose) {
          this.attemptReconnect();
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
        this.socket?.close();
      };
    } catch (error) {
      console.error('WebSocket Connection Failed:', error);
      this.attemptReconnect();
    }
  }

  public disconnect(): void {
    this.manualClose = true;
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.notifyStatus('closed');
  }

  public send(data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not open. Queuing message not implemented yet.');
    }
  }

  public addMessageHandler(handler: MessageHandler): void {
    this.messageHandlers.add(handler);
  }

  public removeMessageHandler(handler: MessageHandler): void {
    this.messageHandlers.delete(handler);
  }

  public onStatusChange(handler: (status: WebSocketStatus) => void): void {
    this.statusChangeHandlers.add(handler);
  }

  public offStatusChange(handler: (status: WebSocketStatus) => void): void {
    this.statusChangeHandlers.delete(handler);
  }

  private notifyHandlers(data: any): void {
    this.messageHandlers.forEach(handler => handler(data));
  }

  private notifyStatus(status: WebSocketStatus): void {
    this.statusChangeHandlers.forEach(handler => handler(status));
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting in ${this.reconnectInterval}ms... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(), this.reconnectInterval);
    } else {
      console.error('Max reconnect attempts reached.');
    }
  }
}

export default WebSocketService;
