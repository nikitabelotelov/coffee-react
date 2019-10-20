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
    
    return [Constants.startBit, length].concat(messageBits).concat([code, Constants.endBit])
  }

  public getMessageFromCode(code: number[]):string {
    const length = code[1]
    let message = ''
    let lastByte = 0xFF
    if (code.length !== length + 4) {
      return ''
    }
    for (let i=0; i<length; i++) {
      const char = code[i + 2]
      message = `${message}${String.fromCharCode(char)}`
      lastByte = lastByte ^ char
    }
    if (code[length+2] !== lastByte) {
      return ''
    }
    return message
  }
}

export default Message