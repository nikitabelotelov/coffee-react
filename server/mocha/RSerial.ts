import { Serial } from "raspi-serial";
import Converter, { ISTMMessage, StmMessages } from "../stm/Converter";
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
  }
]

const mochaSettings = {
  [StmMessages.SetGroup1Temperature]: '1000',
  [StmMessages.SetGroup1AutoMode1]: '200',
  [StmMessages.SetGroup1AutoMode2]: '400',
  [StmMessages.SetGroup2Temperature]: '1200',
  [StmMessages.SetGroup2AutoMode1]: '100',
  [StmMessages.SetGroup2AutoMode2]: '200',
  [StmMessages.SetSteamPressure]: '800',

  [StmMessages.SetRedCold]: '0',
  [StmMessages.SetGreenCold]: '0',
  [StmMessages.SetBlueCold]: '0',
  [StmMessages.SetRedHot]: '16',
  [StmMessages.SetGreenHot]: '16',
  [StmMessages.SetBlueHot]: '16'
}

console.log('Start interval')
setInterval(()=>{
  if (mochaSettings[StmMessages.SetSteamPressure] !== messages[0].content) {
    const steam = +mochaSettings[StmMessages.SetSteamPressure]
    let realSteam = +messages[0].content
    if (realSteam > steam) {
      realSteam--
    } else {
      realSteam++
    }
    messages[0].content = `${realSteam}`
  }
}, 1000)


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

  public msg = 0
  public startMessages(func: any) {
    setTimeout(() => {
      if (!messages[this.msg]) {
        this.msg = 0
      }
      const msgObject = new Message()
      const msg = msgObject.getMessageFromString(Converter.toString(messages[this.msg]))
      func(msg)
      this.msg++
      this.startMessages(func)
    }, 1000)
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
    const stmM = Converter.fromString(message)

    console.log('STM:', stmM)
    // @ts-ignore
    mochaSettings[stmM.id] = stmM.content
    setTimeout(()=>{
      cb()
    }, 100)
  }

  public flush(cb?: any): void {
   
  }

}