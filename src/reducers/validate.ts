import { StmMessages } from "../../server/stm/Converter";

const checkObject:any = {}
export const Validate = (id: StmMessages, value: string): boolean => {
  switch (id) {
    case StmMessages.Button1:
    case StmMessages.Button2:
    case StmMessages.Button3:
    case StmMessages.Button4:
    case StmMessages.Button5:
    case StmMessages.Button6:
    case StmMessages.Button7:
    case StmMessages.Button8:
    case StmMessages.Button9:
      if ( value === '2' ) {
        if (checkObject[id] === true) {
          return true
        } else {
          checkObject[id] = true
          return false
        }
      } else {
        checkObject[id] = false
        return (value === '1') 
      }
    
    default:
      return true
  }

} 