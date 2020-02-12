import { IObjectAny, ProcessStatus, ICommandBlock } from "../../types";
import { store } from "../serverRedux"
import { StmMessages, StmCommands } from "../../../server/stm/Converter";

export const SteamPressure = (
  state: IObjectAny,
  commands: ICommandBlock,
  changeStatus: (newStatus: ProcessStatus) => void
): IObjectAny => {
  const machine = store.getState().machine;
  const settings = store.getState().settings

  if (state.stop) {
    return state;
  }

  if (machine[StmMessages.Button1] === '1') {
    changeStatus(ProcessStatus.done)
    return state
  }

  if (machine[StmMessages.WaterLevel] !== '1') {
    return state
  }

  const pressure = parseInt(machine[StmMessages.SteamPressure], 10) || 0;
  const needPressure = (parseFloat(settings.SteamPressure) || 0) * 200;

  /* TODO: energy mode
  const isEnergyMode = settings.EnergyMode === '1';
  if (isEnergyMode) {
		NeedWork = (LEVEL_STEAM_VALUE > LevelSteamMin) && (TEMP_STEAM_MIDDLE < 75) && (COMPR_STEAM2_HUMAN_VALUE < ComprSteamWorkMax);
		NeedWorkEnd = (TEMP_STEAM_MIDDLE >= 90);
		NeedStartFastHot = 0;
		NeedStartTen = (LEVEL_STEAM_VALUE > LevelSteamMin) && (TEMP_STEAM_MIDDLE < 75);
		NeedFinishTen = (TEMP_STEAM_MIDDLE >= 90);
	}
  */
  if (pressure < needPressure) {
    if (!state.started) {
      state.started = Date.now()
    }
    if (Date.now() - state.started > 1000) {
      state.wasStartedWarm = 1
      changeStatus(ProcessStatus.wip)
      commands[StmCommands.SetRelay1]++
      commands[StmCommands.SetRelay2]++
    }
  } else if (state.wasStartedWarm && pressure < needPressure + 50) {
    changeStatus(ProcessStatus.wip)
    commands[StmCommands.SetRelay1]++
    commands[StmCommands.SetRelay2]++
  } else {
    state.started = 0
    state.wasStartedWarm = 0
    changeStatus(ProcessStatus.done)
  }

  return { ...state };
};
