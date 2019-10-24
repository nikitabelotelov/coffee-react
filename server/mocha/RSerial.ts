import { Serial } from "raspi-serial";
import Converter, { ISTMMessage, StmMessages, ISTMCommand, StmCommands } from "../stm/Converter";
import Message from "../usart/Message";


const messages:ISTMMessage[] = [
  {
    id: StmMessages.SteamPressure,
    content: '1024'
  },
  {
    id: StmMessages.Group1Pressure,
    content: '587'
  },
  {
    id: StmMessages.Group1Temperature,
    content: '882'
  },
  {
    id: StmMessages.Group2Pressure,
    content: '432'
  },
  {
    id: StmMessages.Group2Temperature,
    content: '909'
  },
  {
    id: StmMessages.WaterLevel,
    content: '0'
  },
  {
    id: StmMessages.Relay1,
    content: '0'
  }
]


const MochaMashine = {
  needWater: '0',
}

const waterProcess = () => {
  setTimeout(()=>{
    messages[5].content = '1'
  }, 10000)
}

setInterval(() => {
  if (MochaMashine.needWater === '1' && messages[6].content === '0') {
    messages[6].content = '1'
    waterProcess()
  }
  if (MochaMashine.needWater === '0') {
    messages[6].content = '0'
  }
}, 100)


export class RSerial {
  validateAlive: undefined
  addListener: undefined 
  once: undefined
  _alive: undefined
  alive: undefined
  _pins: undefined
  pins: undefined
  port: undefined 
  baudRate: undefined 
  dataBits: undefined 
  stopBits: undefined
  parity: undefined 
  destroy: undefined 
  prependListener: undefined 
  prependOnceListener: undefined
  removeListener: undefined 
  off: undefined 
  removeAllListeners: undefined 
  setMaxListeners: undefined
  getMaxListeners: undefined 
  listeners: undefined 
  rawListeners: undefined 
  emit: undefined
  eventNames: undefined 
  listenerCount: undefined
  private _portId: string = '123';
  private _options: string;
  private _portInstance: string;
  private _isOpen: string;
  public echoAns: string;
  public msg = 0
  public startMessages(func: any) {
    setTimeout(() => {
      if (!messages[this.msg]) {
        this.msg = 0
      }
      const msgObject = new Message()
      const msg = msgObject.getMessageFromString(Converter.toString(messages[this.msg]))
      func(msg)
      if (this.echoAns) {
        const msg = msgObject.getMessageFromString(Converter.toString({id: StmMessages.Echo, content: this.echoAns}))
        this.echoAns = ''
        func(msg)
      }
      this.msg++
      this.startMessages(func)
    }, 100)
  }

  public on(a: string, f: any) {
    this.startMessages(f)
    return this
  }

  

  public open(cb?: ()=>void): void {
   setTimeout(() => {
    cb && cb()
   }, 1000)
  }

  public close(cb?:any):any {
   
  }

  public write(data: Buffer | string, cb?: any): void {
    const msg = new Message()
    // @ts-ignore
    const message = msg.getMessageFromCode(data)
    const stmM:ISTMCommand = Converter.fromString(message) as ISTMCommand
    this.echoAns = message
    console.log('STM:', stmM)
    // @ts-ignore
    
    switch (stmM.id) {
      case StmCommands.SetRelay1:
        MochaMashine.needWater = stmM.content
        break
    }

    setTimeout(()=>{
      cb()
    }, 100)
  }

  public flush(cb?: any): void {
   
  }

}