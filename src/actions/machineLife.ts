import store, { emitStm } from "../SettingsStore"
import Converter, { StmMessages, StmCommands } from "../../server/stm/Converter"
import Message from "../../server/usart/Message"
import ACTION_TYPES from "./actionTypes"
import { Process } from "./Process"
import { IObjectAny, ProcessStatus, ICommandBlock } from "../types"
import { WaterLevel } from "./life/WaterLevel"
import { WaterLevelGroup } from "./life/WaterLevelGroup"
import { BoilProcessGroup } from "./life/BoilProcessGroup"


export interface IProcesses {
  process: Process
  children: Process[]
}

class MachineLife {
  
  public processes: IProcesses[] = []

  public addProcess(p: IProcesses) {
    p.process.onStatusChange = (newStatus: ProcessStatus, oldStatus: ProcessStatus) => {
      p.children.forEach(process => {
        if (newStatus === ProcessStatus.done) {
          process.start()
        } else {
          process.stop()
        }
      })
    }
    this.processes.push(p)
  }

  constructor() {
    const boilGroup1 = new Process('boilGroup1', BoilProcessGroup(StmMessages.Button2, StmCommands.SetValve2, StmCommands.SetValve4, StmMessages.VolumetricGroup1, 'Group1AutoMode1'), 0)
    boilGroup1.start()

    const waterLevel = new Process('waterLevel', WaterLevel, 20000)
    this.addProcess({
      process: boilGroup1,
      children: [waterLevel]
    })

    const waterLevelG1 = new Process('waterLevelG1', WaterLevelGroup(StmMessages.Group1Pressure, StmCommands.SetValve2, 'Group1Temperature'), 20000)
    const waterLevelG2 = new Process('waterLevelG2', WaterLevelGroup(StmMessages.Group2Pressure, StmCommands.SetValve3, 'Group2Temperature'), 20000)
    waterLevel.start()

    this.addProcess({
      process: waterLevel,
      children: [waterLevelG1, waterLevelG2]
    })
    
    this.addProcess({
      process: waterLevelG1,
      children: []
    })

    this.addProcess({
      process: waterLevelG2,
      children: []
    })
  }

  public checkAndSend(commands:ICommandBlock, command: StmCommands, status: StmMessages) {
    const machine = store.getState().machine
    if (commands[command] > 0) {
      if (machine[status] === '0') {
        emitStm({id: command, content: '1'})
      }
    } else {
      if (machine[status] === '1') {
        emitStm({id: command, content: '0'})
      }
    }
  }

  public step() {

    const commands:ICommandBlock = {
      [StmCommands.SetValve1]: 0,
      [StmCommands.SetValve2]: 0,
      [StmCommands.SetValve3]: 0,
      [StmCommands.SetValve4]: 0,
      [StmCommands.SetValve5]: 0,
      [StmCommands.SetValve6]: 0,
      
      [StmCommands.SetRelay1]: 0,
      [StmCommands.SetRelay2]: 0,
      [StmCommands.SetRelay3]: 0,
      [StmCommands.SetRelay4]: 0,
      [StmCommands.SetRelay5]: 0,
      [StmCommands.SetRelay6]: 0,
      [StmCommands.SetRelay7]: 0,
      [StmCommands.SetRelay8]: 0,

      [StmCommands.SetRedCold]: 0,
      [StmCommands.SetGreenCold]: 0,
      [StmCommands.SetBlueCold]: 0,
      [StmCommands.SetRedHot]: 0,
      [StmCommands.SetGreenHot]: 0,
      [StmCommands.SetBlueHot]: 0,
    }

    this.processes.forEach(one => {
      if (one.process.isActive) {
        one.process.step(commands)
      }
    })

    
    this.checkAndSend(commands, StmCommands.SetRelay8, StmMessages.Relay8)
    this.checkAndSend(commands, StmCommands.SetValve1, StmMessages.Valve1)
    this.checkAndSend(commands, StmCommands.SetValve2, StmMessages.Valve2)
    this.checkAndSend(commands, StmCommands.SetValve3, StmMessages.Valve3)

  }
}

export const Life = new MachineLife()
