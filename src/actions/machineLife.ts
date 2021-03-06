import Converter, { StmMessages, StmCommands } from "../../server/stm/Converter"
import Message from "../../server/usart/Message"
import ACTION_TYPES from "./actionTypes"
import { Process } from "./Process"
import { IObjectAny, ProcessStatus, ICommandBlock } from "../types"
import { WaterLevel } from "./life/WaterLevel"
import { WaterLevelGroup } from "./life/WaterLevelGroup"
import { BoilProcessGroup } from "./life/BoilProcessGroup"
import { WarmPredict } from "./life/WarmPredict"
import { WarmGroup } from "./life/WarmGroup"
import { SleepMode } from "./life/SleepMode"
import { CleanMode } from "./life/CleanMode"
import { Color } from "./life/Color"
import { store, emitStm } from "./serverRedux"
import { SteamPressure } from "./life/SteamPressure"
import { HotWater } from "./life/HotWater"

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
    const boilGroup1 = new Process('boilGroup1', BoilProcessGroup(StmMessages.Button3, StmCommands.SetValve2, StmCommands.SetValve4, 
      StmMessages.VolumetricGroup1, StmCommands.ResetVolumetricG1, StmCommands.SetSecGroup1, 'Group1AutoMode1', 'Group1Presoaking', 'Group1PostPresoaking'), 0)
    const boilGroup2 = new Process('boilGroup1', BoilProcessGroup(StmMessages.Button6, StmCommands.SetValve3, StmCommands.SetValve5, 
      StmMessages.VolumetricGroup2, StmCommands.ResetVolumetricG2, StmCommands.SetSecGroup2, 'Group2AutoMode1', 'Group2Presoaking', 'Group2PostPresoaking'), 0)
    const waterLevel = new Process('waterLevel', WaterLevel, 0)
    const predictWarm = new Process('predictWarm', WarmPredict, 0)
    const sleepMode = new Process('SleepMode', SleepMode, 0)
    const hotWater = new Process('HotWater', HotWater, 0, ProcessStatus.done)
    const colorG1 = new Process('ColorG1', Color("Group1Temperature", "middleTTrendG1", StmCommands.SetRedGroup1, StmCommands.SetGreenGroup1, StmCommands.SetBlueGroup1), 0)
    const colorG2 = new Process('ColorG2', Color("Group2Temperature", "middleTTrendG2", StmCommands.SetRedGroup2, StmCommands.SetGreenGroup2, StmCommands.SetBlueGroup2), 0)
    const cleanMode = new Process('CleanMode', CleanMode(StmMessages.Button9), 0)
    const waterLevelG1 = new Process('waterLevelG1', WaterLevelGroup(StmMessages.Group1Pressure, StmCommands.SetValve2, 'Group1Temperature'), 0)
    const waterLevelG2 = new Process('waterLevelG2', WaterLevelGroup(StmMessages.Group2Pressure, StmCommands.SetValve3, 'Group2Temperature'), 0)

    const warmG1 = new Process('warmG1', WarmGroup(StmMessages.Group1Pressure, StmCommands.SetRelay4, StmCommands.SetRelay5, "Group1Temperature", "middleTTrendG1"), 0)
    const warmG2 = new Process('warmG2', WarmGroup(StmMessages.Group2Pressure, StmCommands.SetRelay6, StmCommands.SetRelay7, "Group2Temperature", "middleTTrendG2"), 0)

    const steamPressure = new Process('steam', SteamPressure, 0)
    this.addProcess({
      process: colorG1,
      children: []
    })
    this.addProcess({
      process: colorG2,
      children: []
    })
    this.addProcess({
      process: cleanMode,
      children: [boilGroup1, boilGroup2, predictWarm]
    })

    this.addProcess({
      process: sleepMode,
      children: []
    })
    this.addProcess({
      process: hotWater,
      children: [],
    })
    this.addProcess({
      process: boilGroup1,
      children: [waterLevelG1]
    })
    this.addProcess({
      process: boilGroup2,
      children: [waterLevelG2]
    })

    colorG1.start()
    colorG2.start()

    boilGroup1.start()
    boilGroup2.start()

    waterLevel.start()
    predictWarm.start()

    waterLevelG1.start()
    waterLevelG2.start()

    warmG1.start()
    warmG2.start()

    cleanMode.start()
    sleepMode.start()

    hotWater.start()

    this.addProcess({
      process: steamPressure,
      children: []
    })

    steamPressure.start()
    
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

    this.addProcess({
      process: predictWarm,
      children: []
    })

    this.addProcess({
      process: warmG1,
      children: []
    })
    this.addProcess({
      process: warmG2,
      children: []
    })
  }

  public checkAndSend(commands:ICommandBlock, command: StmCommands, status: StmMessages) {
    const machine = store.getState().machine
    if (commands[command] > 0) {
      if (machine[status] === '2') {
        this.needSend = true
        emitStm({id: command, content: '1'})
      }
    } else {
      if (machine[status] === '1') {
        this.needSend = true
        emitStm({id: command, content: '0'})
      }
    }
  }

  public count: number = 0
  public needSend: boolean = false
  public step() {
    const machine = store.getState().machine
    this.needSend = false
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

      [StmCommands.SetLightButton1]: 0,
      [StmCommands.SetLightButton2]: 0,
      [StmCommands.SetLightButton3]: 0,
      [StmCommands.SetLightButton4]: 0,
      [StmCommands.SetLightButton5]: 0,
      [StmCommands.SetLightButton6]: 0,
      [StmCommands.SetLightButton7]: 0,
      [StmCommands.SetLightButton8]: 0,
      [StmCommands.SetLightButton9]: 0,
    }

    this.processes.forEach(one => {
      if (one.process.isActive) {
        one.process.step(commands)
      }
    })
     
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

    const vol1 = parseInt(machine[StmMessages.VolumetricGroup1]) || 1
    if (vol1 > 1 && commands[StmCommands.ResetVolumetricG1] > 0) {
      this.needSend = true
      emitStm({id: StmCommands.ResetVolumetricG1, content: '1'})
    }
    const vol2 = parseInt(machine[StmMessages.VolumetricGroup2]) || 1
    if (vol2 > 1 && commands[StmCommands.ResetVolumetricG2] > 0) {
      this.needSend = true
      emitStm({id: StmCommands.ResetVolumetricG2, content: '1'})
    }

    if (commands[StmCommands.SetSecGroup1] > 0) {
      this.needSend = true
      emitStm({id: StmCommands.SetSecGroup1, content: `${commands[StmCommands.SetSecGroup1]}`})
    }
    if (commands[StmCommands.SetSecGroup2] > 0) {
      this.needSend = true
      emitStm({id: StmCommands.SetSecGroup2, content: `${commands[StmCommands.SetSecGroup2]}`})
    }

    const procG1 = this.processes.find(pr => pr.process.name === 'ColorG1' ) 
    if (procG1 && procG1.process && procG1.process.status === ProcessStatus.done) {
      emitStm({id: StmCommands.SetRedGroup1, content: `${commands[StmCommands.SetRedGroup1]}`})
      emitStm({id: StmCommands.SetBlueGroup1, content: `${commands[StmCommands.SetBlueGroup1]}`})
      emitStm({id: StmCommands.SetGreenGroup1, content: `${commands[StmCommands.SetGreenGroup1]}`})
    }
    const procG2 = this.processes.find(pr => pr.process.name === 'ColorG2' ) 
    if (procG2 && procG2.process && procG2.process.status === ProcessStatus.done) {
      emitStm({id: StmCommands.SetRedGroup2, content: `${commands[StmCommands.SetRedGroup2]}`})
      emitStm({id: StmCommands.SetBlueGroup2, content: `${commands[StmCommands.SetBlueGroup2]}`})
      emitStm({id: StmCommands.SetGreenGroup2, content: `${commands[StmCommands.SetGreenGroup2]}`})
    }

    emitStm({id: StmCommands.SetLightButton1, content: `${commands[StmCommands.SetLightButton1]}`})
    emitStm({id: StmCommands.SetLightButton8, content: `${commands[StmCommands.SetLightButton8]}`})
    emitStm({id: StmCommands.SetLightButton9, content: `${commands[StmCommands.SetLightButton9]}`})

    emitStm({id: StmCommands.PackageEnd, content: `1`})
  }
}

export const Life = new MachineLife()
