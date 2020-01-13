export type ICallbackMsg = (msg: string) => void

export class WebSocketController {
  private socket: WebSocket = null;
  private receivedMsgCallbacks: Array<ICallbackMsg> = [];

  private handleMessage(data: string) {
    this.receivedMsgCallbacks.forEach((el) => {
      el(data);
    })
  }

  private socketConnected: boolean = false;
  private queue: Array<string> = [];

  public init() {
    this.socket = new WebSocket(location.origin.replace(/^http/, 'ws'));
    this.socket.onopen = () => {
      // @ts-ignore
      if (window.needRefreshGlobal) {
        window.location.href = '/'
        return
      }
      console.log("Соединение установлено.");
      this.socketConnected = true;
      this.queue.forEach((msg) => {
        this.send(msg);
      });
      this.queue = [];
    };

    this.socket.onclose = (event) => {
      this.socketConnected = false;
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения'); // например, "убит" процесс сервера
      }
      console.log('Код: ' + event.code + ' причина: ' + event.reason);
      setTimeout(() => {
        this.init()
      }, 1000)
    };

    this.socket.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    this.socket.onerror = (error) => {
      //@ts-ignore
      console.log("Ошибка " + error.message);
    };
  }
  constructor() {
    this.init()
  }

  registerCallback(callback: ICallbackMsg) {
    this.receivedMsgCallbacks.push(callback);
  }

  unRegisterCallback(callback: ICallbackMsg) {
    this.receivedMsgCallbacks.splice(this.receivedMsgCallbacks.indexOf(callback));
  }

  send(msg: string) {
    if (this.socketConnected) {
      this.socket.send(msg);
    } else {
      this.queue.push(msg);
    }
  }

}