import { Serial } from "raspi-serial";
import Constants from './Constants';
import Message from "./Message";
import buffer from 'buffer';

class Usart {
  public buffer: number[] = []
  public msgHandlers: ((message: string)=>void)[] = []
  public serial:Serial|undefined
  public queue: number[][] = []
  public inProgress: boolean = false
  constructor(serial: Serial) {
    serial.open(() => {
      this.serial = serial
      console.log("Serial opened");
      serial.on('data', (data: Buffer) => {
        // @ts-ignore
        this.buffer = [...this.buffer, ...data]
        this.extractMessage()
      })
      this.queueProcess()
    })
  }

  extractMessage() {
    const start = this.buffer.indexOf(Constants.startBit.charCodeAt(0))
    if (start > -1) {
      this.buffer = this.buffer.slice(start)
      const end = this.buffer.indexOf(Constants.endBit.charCodeAt(0))
      if (end > -1) {
        const message = this.buffer.splice(0, end+1)
        this.buffer = this.buffer.slice(end + 1)
        // console.log('ms=', message)
        const msgObject = new Message()
        const stringMsg = msgObject.getMessageFromCode(message)
        // console.log("Received data from usart. " + stringMsg);
        this.msgHandlers.forEach(el => el(stringMsg))
        this.extractMessage()
      }
    }
  }

  sendMessage(message: string) {
    const msgObject = new Message()
    this.queue.push(msgObject.getMessageFromString(message))
    //console.log("Pushed to queue");
    this.queueProcess()
  }

  queueProcess() {
    if (this.serial && !this.inProgress) {
      if (this.queue.length > 0) {
        const msg = buffer.Buffer.from(this.queue[0]);
        this.queue = this.queue.slice(1)
        this.inProgress = true
        //console.log("Write to serial " + JSON.stringify(msg));
        this.serial.write(msg, () => {
          this.inProgress = false
          this.queueProcess()
        })
      }
    }
  }
}

export default Usart