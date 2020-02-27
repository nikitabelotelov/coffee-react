import { IObjectAny, ProcessStatus, ICommandBlock } from "../../types";
import { store } from "../serverRedux"
import { StmMessages, StmCommands } from "../../../server/stm/Converter";

export const Color = (
  setTemp: 'Group1Temperature' | 'Group2Temperature',
  trend: 'middleTTrendG1' | 'middleTTrendG2',
  red: StmCommands.SetRedGroup1 | StmCommands.SetRedGroup2,
  green: StmCommands.SetGreenGroup1 | StmCommands.SetGreenGroup2,
  blue: StmCommands.SetBlueGroup1 | StmCommands.SetBlueGroup2,
  
) => (
  state: IObjectAny,
  commands: ICommandBlock,
  changeStatus: (newStatus: ProcessStatus) => void
): IObjectAny => {
  const machine = store.getState().machine
  const settings = store.getState().settings
  const life = store.getState().life

  const redHot = (parseInt(settings.RedHot, 10) || 0) / 16
  const greenHot = (parseInt(settings.GreenHot, 10) || 0) / 16
  const blueHot = (parseInt(settings.BlueHot, 10) || 0) / 16
  const alphaHot = (parseInt(settings.AlphaHot, 10) || 0) / 16
  const redCold = (parseInt(settings.RedCold, 10) || 0) / 16
  const greenCold = (parseInt(settings.GreenCold, 10) || 0) / 16
  const blueCold = (parseInt(settings.BlueCold, 10) || 0) / 16
  const alphaCold = (parseInt(settings.AlphaCold, 10) || 0) / 16

  if (state.stop) {
    return state;
  }
  let needTemp = parseInt(settings[setTemp], 10) || 0
  const trendG = life[trend]
  const temperature = trendG[trendG.length - 1] && trendG[trendG.length - 1].value || 0

  

  switch(state.step) {
    case '1':
      if (Date.now() - state.stepStart > 1000) {
        changeStatus(ProcessStatus.wip)
      }
    break;
    
    default:
      changeStatus(ProcessStatus.done)
      
      state.stepStart = Date.now()
      if (machine[StmMessages.Button1] === '1') {
        commands[red] = 0
        commands[green] = 0
        commands[blue] = 0
        return { ...state };
      }

      if (needTemp < 70) {
        commands[red] = 0
        commands[green] = 0
        commands[blue] = 0
        return { ...state };
      }

      if (temperature+10 >= needTemp){
        commands[red] = Math.round((redHot*alphaHot) * 65534);
        commands[green] = Math.round((greenHot*alphaHot) * 65534);
        commands[blue] = Math.round((blueHot*alphaHot) * 65534);
      } else {
        commands[red] = Math.round((temperature * redHot * alphaHot / needTemp) * 65534 + ((needTemp - temperature) / needTemp) * redCold * alphaCold * 65534);
        commands[green] = Math.round((temperature * greenHot * alphaHot / needTemp) * 65534 + ((needTemp - temperature) / needTemp) * greenCold * alphaCold * 65534);
        commands[blue] = Math.round((temperature * blueHot * alphaHot / needTemp) * 65534 + ((needTemp - temperature) / needTemp) * blueCold * alphaCold * 65534);
        if (commands[red] > 65534) {
          commands[red] = 65534
        }
        if (commands[green] > 65534) {
          commands[green] = 65534
        }
        if (commands[blue] > 65534) {
          commands[blue] = 65534
        }
      }
      break
  }
  return { ...state };
};
