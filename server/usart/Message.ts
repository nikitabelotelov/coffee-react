import Constants from './Constants';

class Message {

  public getMessageFromString(message:string):number[] {
    const length = message.length
    
    const messageBits:number[] = []
    let code:number = 0xFF
    for (let i=0; i<length; i++) {
      const char = message.charCodeAt(i)
      messageBits.push(char) 
      code = code ^ char
    }
    
    return [Constants.startBit.charCodeAt(0), length].concat(messageBits).concat([code, Constants.endBit.charCodeAt(0)])
  }

  public getMessageFromCode(code: number[]):string {
    const length = code[2]
    let message = ''
    let lastByte = 0xFF
    if (code.length !== length + 4) {
      return ''
    }
    for (let i=0; i<length; i++) {
      const char = code[i + 3]
      message = `${message}${String.fromCharCode(char)}`
      lastByte = lastByte ^ char
    }
    if (code[length+3] !== lastByte) {
      return ''
    }
    return message
  }
}

export default Message