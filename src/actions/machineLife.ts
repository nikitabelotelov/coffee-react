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
    const boilGroup1 = new Process('boilGroup1', BoilProcessGroup(StmMessages.Button3, StmCommands.SetValve2, StmCommands.SetValve4, StmMessages.VolumetricGroup1, StmCommands.ResetVolumetricG1, 'Group1AutoMode1'), 0)
    const boilGroup2 = new Process('boilGroup1', BoilProcessGroup(StmMessages.Button6, StmCommands.SetValve3, StmCommands.SetValve5, StmMessages.VolumetricGroup2, StmCommands.ResetVolumetricG2, 'Group1AutoMode2'), 0)
    const waterLevel = new Process('waterLevel', WaterLevel, 20000)
    const waterLevelG1 = new Process('waterLevelG1', WaterLevelGroup(StmMessages.Group1Pressure, StmCommands.SetValve2, 'Group1Temperature'), 20000)
    const waterLevelG2 = new Process('waterLevelG2', WaterLevelGroup(StmMessages.Group2Pressure, StmCommands.SetValve3, 'Group2Temperature'), 20000)


    this.addProcess({
      process: boilGroup1,
      children: [waterLevelG1]
    })
    this.addProcess({
      process: boilGroup2,
      children: [waterLevelG2]
    })

    boilGroup1.start()
    boilGroup2.start()

    waterLevel.start()

    this.addProcess({
      process: waterLevel,
      children: []
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

  public count: number = 0

  public step() {
    const machine = store.getState().machine
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

      [StmCommands.SetRedGroup1]: 0,
      [StmCommands.SetGreenGroup1]: 0,
      [StmCommands.SetBlueGroup1]: 0,
      [StmCommands.SetRedGroup2]: 0,
      [StmCommands.SetGreenGroup2]: 0,
      [StmCommands.SetBlueGroup2]: 0,
      
      [StmCommands.SetRedMachine]: 0,
      [StmCommands.SetGreenMachine]: 0,
      [StmCommands.SetBlueMachine]: 0,

      [StmCommands.ResetVolumetricG1]: 0,
      [StmCommands.ResetVolumetricG2]: 0,

      [StmCommands.SetSecGroup1]: 100,
      [StmCommands.SetSecGroup2]: 100,
    }

    this.processes.forEach(one => {
      if (one.process.isActive) {
        one.process.step(commands)
      }
    })

    if (this.count === 0) {
      this.count = 1
      emitStm({id: StmCommands.SetBlueGroup1, content: '50000'})
      emitStm({id: StmCommands.SetBlueGroup2, content: '50000'})
    } else {
      this.count = 0
      emitStm({id: StmCommands.SetBlueGroup1, content: '0'})
      emitStm({id: StmCommands.SetBlueGroup2, content: '0'})
    }
    
    this.checkAndSend(commands, StmCommands.SetRelay1, StmMessages.Relay1)
    this.checkAndSend(commands, StmCommands.SetRelay2, StmMessages.Relay2)
    this.checkAndSend(commands, StmCommands.SetRelay3, StmMessages.Relay3)
    this.checkAndSend(commands, StmCommands.SetRelay4, StmMessages.Relay4)
    this.checkAndSend(commands, StmCommands.SetRelay5, StmMessages.Relay5)
    this.checkAndSend(commands, StmCommands.SetRelay6, StmMessages.Relay6)
    this.checkAndSend(commands, StmCommands.SetRelay7, StmMessages.Relay7)
    this.checkAndSend(commands, StmCommands.SetRelay8, StmMessages.Relay8)
    this.checkAndSend(commands, StmCommands.SetValve1, StmMessages.Valve1)
    this.checkAndSend(commands, StmCommands.SetValve2, StmMessages.Valve2)
    this.checkAndSend(commands, StmCommands.SetValve3, StmMessages.Valve3)
    this.checkAndSend(commands, StmCommands.SetValve4, StmMessages.Valve4)
    this.checkAndSend(commands, StmCommands.SetValve5, StmMessages.Valve5)
    this.checkAndSend(commands, StmCommands.SetValve6, StmMessages.Valve6)

    const vol1 = parseInt(machine[StmMessages.VolumetricGroup1]) || 0
    if (vol1 > 0 && commands[StmCommands.ResetVolumetricG1] > 0) {
      emitStm({id: StmCommands.ResetVolumetricG1, content: '1'})
    }
    const vol2 = parseInt(machine[StmMessages.VolumetricGroup2]) || 0
    if (vol2 > 0 && commands[StmCommands.ResetVolumetricG2] > 0) {
      emitStm({id: StmCommands.ResetVolumetricG2, content: '1'})
    }

  }
}

export const Life = new MachineLife()
