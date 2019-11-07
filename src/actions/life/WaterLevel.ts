import { IObjectAny, ProcessStatus, ICommandBlock } from "../../types";
import store, { emitStm } from "../../SettingsStore";
import { StmMessages, StmCommands } from "../../../server/stm/Converter";

export const WaterLevel = (state: IObjectAny, commands: ICommandBlock, changeStatus: (newStatus: ProcessStatus) => void): IObjectAny => {
  const machine = store.getState().machine
  
  if (state.stop) {
    return state
  }

  switch (machine[StmMessages.WaterLevel]) {
    case "1":
      if (state.wasWIP && state.doneTime < 5000) {
        changeStatus(ProcessStatus.done)
        commands[StmCommands.SetValve1] = 1
        commands[StmCommands.SetRelay8]++
      } else {
        state.wasWIP = 0
      }
      break
    case "0":
      changeStatus(ProcessStatus.wip)
      commands[StmCommands.SetValve1] = 1
      commands[StmCommands.SetRelay8]++
      state.wasWIP = 1
      break
  }

  return {...state}
}