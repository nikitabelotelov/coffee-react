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
      serial.on('data', (data: number[]) => {
        this.buffer = [...this.buffer, ...data] 
        this.extractMessage()
      })
      this.queueProcess()
    })
  }

  extractMessage() {
    const start = this.buffer.indexOf(Constants.startBit)
    if (start > -1) {
      this.buffer = this.buffer.slice(start)
      const end = this.buffer.indexOf(Constants.endBit)
      const message = this.buffer.splice(0, end+1)
      const msgObject = new Message()
      const stringMsg = msgObject.getMessageFromCode(message)
      this.msgHandlers.forEach(el => el(stringMsg))
      this.extractMessage()
    }
  }

  sendMessage(message: string) {
    const msgObject = new Message()
    this.queue.push(msgObject.getMessageFromString(message))
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