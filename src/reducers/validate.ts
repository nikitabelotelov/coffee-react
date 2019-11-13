import { StmMessages } from "../../server/stm/Converter";

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
      return (value === '1' || value === '2')
      
    
    default:
      return true
  }

} 