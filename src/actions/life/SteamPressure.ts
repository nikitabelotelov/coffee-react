import { IObjectAny, ProcessStatus, ICommandBlock } from "../../types";
import store, { emitStm } from "../../SettingsStore";
import { StmMessages, StmCommands } from "../../../server/stm/Converter";

export const SteamTemperature = (
  state: IObjectAny,
  commands: ICommandBlock,
  changeStatus: (newStatus: ProcessStatus) => void
): IObjectAny => {
  const machine = store.getState().machine;
  const settings = store.getState().settings

  if (state.stop) {
    return state;
  }

  const pressure = parseInt(machine[StmMessages.SteamPressure], 10) || 0;
  const needPressure = parseInt(settings.SteamPressure) || 0;

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
    changeStatus(ProcessStatus.wip)
    commands[StmCommands.SetRelay1]++
    commands[StmCommands.SetRelay2]++
  } else {
    changeStatus(ProcessStatus.done)
  }

  return { ...state };
};
