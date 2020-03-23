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

  Button1 = 'z',
  Button2 = 'A',
  Button3 = 'B',
  Button4 = 'C',
  Button5 = 'D',
  Button6 = 'E',
  Button7 = 'F',
  Button8 = 'G',
  Button9 = 'H',
  
  VolumetricGroup1 = 'K',
  VolumetricGroup2 = 'L',

  PackageEnd = 'M'

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

  SetRedGroup1 = 'P',
  SetGreenGroup1 = 'Q',
  SetBlueGroup1 = 'R',
  SetRedGroup2 = 'S',
  SetGreenGroup2 = 'T',
  SetBlueGroup2 = 'U',

  ResetVolumetricG1 = 'V',
  ResetVolumetricG2 = 'W',

  SetSecGroup1 = 'X',
  SetSecGroup2 = 'Y',
  
  SetRedMachine = 'Z',
  SetGreenMachine = 'a',
  SetBlueMachine = 'b',
  
  PackageEnd = 'c',

  SetLightButton1 = 'd',
  SetLightButton2 = 'e',
  SetLightButton3 = 'f',
  SetLightButton4 = 'g',
  SetLightButton5 = 'h',
  SetLightButton6 = 'j',
  SetLightButton7 = 'k',
  SetLightButton8 = 'l',
  SetLightButton9 = 'm',
  
}

/*				
*/

const TempratureData = [4331, 4281, 4232, 4225, 4218, 4211, 4204, 4197, 4190, 4183, 4176, //11
  4467, 4348, 4229, 4107, 4085, 4063, 4040, 4018, 3996, 3971, 3946, //22
  3863, 3780, 3698, 3710, 3673, 3640, 3606, 3573, 3539, 3506, 3472, //33
  3437, 3416, 3395, 3375, 3400, 3359, 3317, 3276, 3235, 3193, 3152,
  3127, 3090, 3048, 3006, 2964, 2922, 2880, 2839, 2797, 2755, 2721,
  2688, 2656, 2618, 2594, 2531, 2494, 2469, 2436, 2402, 2353, 2317,
  2282, 2245, 2211, 2164, 2122, 2082, 2057, 2008, 1973, 1936, 1899,
  1874, 1812, 1775, 1737, 1712, 1675, 1638, 1626, 1570, 1514, 1458,
  1402, 1346, 1291, 1241, 1220, 1199, 1178, 1157, 1135, 1114, 1093,
  1072, 1051, 1030, 1009, 988, 967, 946, 924, 903, 882, 861,
  840, 819, 798, 777, 756, 735, 714, 692, 671, 650, 629,
  608, 587, 566, 545, 524, 503, 481, 460, 439, 418, 397,
  376, 355, 334, 313, 292, 271, 249, 228, 207, 186, 165,
  144, 123, 102, 81, 60, 38, 17, 2]

const HAND_COLIBR_VOLTAGE = 2290
const VoltCalibrBase = 1950

TempratureData.forEach((value, index) => {
  TempratureData[index] = value * HAND_COLIBR_VOLTAGE / VoltCalibrBase;
})



const Converter = {
  fromString: (msg: string):ISTMMessage | ISTMCommand => {
    return {id: msg[0] as StmMessages, content: msg.substring(1)}
  },

  toString: (msg: ISTMMessage | ISTMCommand): string => {
    return `${msg.id}${msg.content}`
  },

  voltToCelsium: (voltage: string): number => {
    const volt = parseInt(voltage, 10) || 0
    for(let i=0; i<TempratureData.length-1; i++) {
      if (TempratureData[i+1]<volt) {
        const desatki = (10 * (volt - TempratureData[i+1]))/
            (TempratureData[i] - TempratureData[i+1]);
        return ((i+1) * 10 - desatki) / 10;
      }
    }
    return 150;
  },

  volumetric: (value: number): number => {
    if (value === 1) {
      return 1
    }
    const DIFFUSOR07 = 365
    //#define DIFFUSOR06 375
    //#define ACTIVEDIFFUSOR DIFFUSOR06
    return Math.round((value*100) / DIFFUSOR07)
  },

  compressure: (value: number): number => {
    if (value < 750) {
      return 0
    }
    return (value - 750) / 2
  }

}


export default Converter