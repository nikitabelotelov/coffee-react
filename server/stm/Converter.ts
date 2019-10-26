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

  Valve1 = 'h', // statuses. When we send "SetValve1, 1" we wait for Valve1 status in messages
  Valve2 = 'k',
  Valve3 = 'l',
  Valve4 = 'm',
  Valve5 = 'n',
  Valve6 = 'o',

  Relay1 = 'p', // the same as Valve. Relay 
  Relay2 = 'q',
  Relay3 = 'r',
  Relay4 = 's',
  Relay5 = 't',
  Relay6 = 'u',
  Relay7 = 'v',
  Relay8 = 'w',
  
  Echo = 'x', // when we need echo message

  WaterLevel = 'y',
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