import { ProcessStatus, IObjectAny, ICommandBlock } from "../types"

export class Process {
  public name: string = ''
  public stateMachine:(state:IObjectAny, commands: ICommandBlock, changeStatus: (newStatus: ProcessStatus) => void) => IObjectAny
  public state: IObjectAny = {}
  public isActive: boolean = false 
  public isReady: boolean = false
  public status: ProcessStatus = ProcessStatus.wip
  public errorTimeout: number = 0
  public wipTimeout: number = 0
  public timeDone: number = 0
  public onStatusChange: (newStatus: ProcessStatus, oldStatus: ProcessStatus) => void

  public onStatusChangeHdl(newStatus: ProcessStatus) {
    if (this.status !== newStatus) {
      this.onStatusChange(newStatus, this.status)
      if (newStatus === ProcessStatus.done) {
        this.timeDone = Date.now()
      } else {
        this.timeDone = 0
      }
    }
    this.status = newStatus
  }

  constructor(name: string, 
              stateMachine: (state:IObjectAny, commands: ICommandBlock, changeStatus: (newStatus: ProcessStatus) => void) => IObjectAny,
              wipTimeout: number ) {
    this.name = name
    this.stateMachine = stateMachine
    this.onStatusChangeHdl = this.onStatusChangeHdl.bind(this)
    this.wipTimeout = wipTimeout
  }

  public start() {
    this.isActive = true
    this.state.stop = false
    this.errorTimeout = 0
  }

  public stop() {
    this.isActive = false
    this.onStatusChangeHdl(ProcessStatus.stopped)
  }

  public step(commands: ICommandBlock) {
    if (!this.errorTimeout && this.wipTimeout) {
      this.errorTimeout = Date.now()
    }
    const wipTime = Date.now() - this.errorTimeout

    if (this.wipTimeout &&  wipTime > this.wipTimeout) {
      this.state.stop = 0
      // TODO:: NOTFIFICATION ERROR
    } 
    if (this.timeDone && this.status === ProcessStatus.done) {
      this.state.doneTime = Date.now() - this.timeDone
      this.state.wipTime = 0
    } else {
      this.state.doneTime = 0
      this.state.wipTime = wipTime
    }
    this.state = this.stateMachine(this.state, commands, this.onStatusChangeHdl)
  }
}