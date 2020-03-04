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
        console.log('                             ----  ', this.buffer)
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
        const msgObject = new Message()
        const stringMsg = msgObject.getMessageFromCode(message)
        if (stringMsg) {
          this.msgHandlers.forEach(el => el(stringMsg))
        }
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
        this.serial.write(msg, () => {
          this.inProgress = false
          this.queueProcess()
        })
      }
    }
  }
}

export default Usart