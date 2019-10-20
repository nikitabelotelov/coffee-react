export interface ISTMMessage {
  id: StmMessages,
  content: string,
}

export enum StmMessages {
  SteamPressure = 'a',
  Group1Pressure = 'b',
  Group1Temperature = 'c',
  Group2Pressure = 'd',
  Group2Temperature = 'e',
  PredictGroupTemperature = 'f',
  Error1 = 'g',

  SetGroup1Temperature = 'A',
  SetGroup1AutoMode1 = 'B',
  SetGroup1AutoMode2 = 'C',
  SetGroup2Temperature = 'D',
  SetGroup2AutoMode1 = 'E',
  SetGroup2AutoMode2 = 'F',
  SetSteamPressure = 'G',

  SetRedCold = 'H',
  SetGreenCold = 'J',
  SetBlueCold = 'K',
  SetRedHot = 'L',
  SetGreenHot = 'M',
  SetBlueHot = 'N'

}

const Converter = {
  fromString: (msg: string):ISTMMessage => {

    return {id: msg[0] as StmMessages, content: msg.substring(1)}
  },

  toString: (msg: ISTMMessage): string => {
    return `${msg.id}${msg.content}`
  }
}


export default Converter