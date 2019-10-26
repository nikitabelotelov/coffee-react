import { Serial } from "raspi-serial";
import Converter, { ISTMMessage, StmMessages, ISTMCommand, StmCommands } from "../stm/Converter";
import Message from "../usart/Message";

const machine = {
  [StmMessages.Relay1]: '0',
  [StmMessages.Relay2]: '0',
  [StmMessages.Relay3]: '0',
  [StmMessages.Relay4]: '0',
  [StmMessages.Relay5]: '0',
  [StmMessages.Relay6]: '0',
  [StmMessages.Relay7]: '0',
  [StmMessages.Relay8]: '0',

  [StmMessages.Valve1]: '0',
  [StmMessages.Valve2]: '0',
  [StmMessages.Valve3]: '0',
  [StmMessages.Valve4]: '0',
  [StmMessages.Valve5]: '0',
  [StmMessages.Valve6]: '0',
  
  [StmMessages.SteamPressure]: '1010',
  [StmMessages.Group1Pressure]: '90',
  [StmMessages.Group1Temperature]: '90',
  [StmMessages.Group2Pressure]: '90',
  [StmMessages.Group2Temperature]: '90',

  [StmMessages.WaterLevel]: '0'
}



const MochaMashine = {
  [StmCommands.SetRelay1]: '0',
  [StmCommands.SetRelay2]: '0',
  [StmCommands.SetRelay3]: '0',
  [StmCommands.SetRelay4]: '0',
  [StmCommands.SetRelay5]: '0',
  [StmCommands.SetRelay6]: '0',
  [StmCommands.SetRelay7]: '0',
  [StmCommands.SetRelay8]: '0',
  
  [StmCommands.SetValve1]: '0',
  [StmCommands.SetValve2]: '0',
  [StmCommands.SetValve3]: '0',
  [StmCommands.SetValve4]: '0',
  [StmCommands.SetValve5]: '0',
  [StmCommands.SetValve6]: '0',


}

const waterProcess = () => {
  setTimeout(()=>{
    machine[StmMessages.WaterLevel] = '1'
  }, 8000)
}

function set(cmd: StmCommands, msg: StmMessages){
  // @ts-ignore
  if (MochaMashine[cmd] === '1' && machine[msg] === '0') {
    // @ts-ignore
    machine[msg] = '1'
  }
  // @ts-ignore
  if (MochaMashine[cmd] === '0') {
    // @ts-ignore
    machine[msg] = '0'
  }
}

setInterval(() => {
  if (MochaMashine[StmCommands.SetRelay8] === '1' && machine[StmMessages.Relay8] === '0') {
    machine[StmMessages.Relay8] = '1'
    if (machine[StmMessages.Relay8] === '1') { // todo check valve
      waterProcess()
    }
  }

  if (MochaMashine[StmCommands.SetRelay8] === '0') {
    machine[StmMessages.Relay8] = '0'
  }

  set(StmCommands.SetValve1, StmMessages.Valve1)
  set(StmCommands.SetValve2, StmMessages.Valve2)
  set(StmCommands.SetValve3, StmMessages.Valve3)
  set(StmCommands.SetValve4, StmMessages.Valve4)
  set(StmCommands.SetValve5, StmMessages.Valve5)
  set(StmCommands.SetValve6, StmMessages.Valve6)

  
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
      const messages = Object.keys(machine)
      if (!messages[this.msg]) {
        this.msg = 0
      }
      const msgObject = new Message()
      // @ts-ignore
      const msg = msgObject.getMessageFromString(Converter.toString({id:messages[this.msg], content: machine[messages[this.msg]]}))
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
    MochaMashine[stmM.id as StmCommands] = stmM.content

    setTimeout(()=>{
      cb()
    }, 100)
  }

  public flush(cb?: any): void {
   
  }

}