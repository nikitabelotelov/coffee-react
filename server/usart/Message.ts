import Constants from './Constants';

class Message {

  public getMessageFromString(message:string):number[] {
    const length = message.length
    
    const messageBits:number[] = []
    let code:number = 0xFF
    for (let i=1; i<length; i++) {
      const char = message.charCodeAt(i)
      messageBits.push(char) 
      code = code ^ char
    }
    
    return [Constants.startBit.charCodeAt(0), message.charCodeAt(0), length - 1].concat(messageBits).concat([code, Constants.endBit.charCodeAt(0)])
  }

  public getMessageFromCode(code: number[]):string {
    const length = code[2]
    let message = `${String.fromCharCode(code[1])}`;
    let lastByte = 0xFF
    if (length === 0) {
      return ''
    }
    if (code.length !== length + 5) {
      console.log('exit1', code.length, length)
      return ''
    }
    for (let i=0; i<length; i++) {
      const char = code[i + 3]
      message = `${message}${String.fromCharCode(char)}`
      lastByte = lastByte ^ char
    }
    if (code[length+3] !== lastByte) {
      console.log('exit2', code[length+3], lastByte)
      return ''
    }
    return message
  }
}

export default Message