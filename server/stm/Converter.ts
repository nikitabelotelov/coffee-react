export interface ISTMMessage {
  id: StmMessages,
  content: string,
}

export interface ISTMCommand {
  id: StmCommands,
  content: string,
}

export enum StmMessages {
  SteamPressure = 'a',
  Group1Pressure = 'b',
  Group1Temperature = 'c',
  Group2Pressure = 'd',
  Group2Temperature = 'e',
  PredictGroupTemperature = 'f',
  Error = 'g',

  Valve1 = 'e', // statuses. When we send "SetValve1, 1" we wait for Valve1 status in messages
  Valve2 = 'f',
  Valve3 = 'g',
  Valve4 = 'h',
  Valve5 = 'k',
  Valve6 = 'l',

  Relay1 = 'm', // the same as Valve. Relay 
  Relay2 = 'n',
  Relay3 = 'o',
  Relay4 = 'p',
  Relay5 = 'q',
  Relay6 = 'r',
  Relay7 = 's',
  Relay8 = 't',
  
  Echo = 'u', // when we need echo message

  WaterLevel = 'v',
}

export enum StmCommands {
  SetValve1 = 'A',
  SetValve2 = 'B',
  SetValve3 = 'C',
  SetValve4 = 'D',
  SetValve5 = 'E',
  SetValve6 = 'F',

  SetRelay1 = 'G',
  SetRelay2 = 'H',
  SetRelay3 = 'J',
  SetRelay4 = 'K',
  SetRelay5 = 'L',
  SetRelay6 = 'M',
  SetRelay7 = 'N',
  SetRelay8 = 'O',

  SetRedCold = 'P',
  SetGreenCold = 'Q',
  SetBlueCold = 'R',
  SetRedHot = 'S',
  SetGreenHot = 'T',
  SetBlueHot = 'U'

}

const Converter = {
  fromString: (msg: string):ISTMMessage | ISTMCommand => {

    return {id: msg[0] as StmMessages, content: msg.substring(1)}
  },

  toString: (msg: ISTMMessage | ISTMCommand): string => {
    return `${msg.id}${msg.content}`
  }
}


export default Converter