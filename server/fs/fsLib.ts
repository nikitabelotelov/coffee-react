import fs from 'fs';
import { ISettingsProfiles, ISettingsState } from '../../src/types';

const settingsProfilesFileName: string = "settingsProfiles.json";

function getDefaultSettingsProfiles(): ISettingsProfiles {
    var profiles: Map<string, ISettingsState> = new Map([
        [ "default", {
            Group1Temperature: '0',
            Group1AutoMode1: '0',
            Group1AutoMode2: '0',
            Group2Temperature: '0',
            Group2AutoMode1: '0',
            Group2AutoMode2: '0',
            SteamPressure: '0',
            RedCold: '0',
            GreenCold: '0',
            BlueCold: '16',
            RedHot: '16',
            GreenHot: '0',
            BlueHot: '0',
            EnergyMode: '0',
        }],
        [ "user", {
            Group1Temperature: '1',
            Group1AutoMode1: '0',
            Group1AutoMode2: '0',
            Group2Temperature: '0',
            Group2AutoMode1: '0',
            Group2AutoMode2: '0',
            SteamPressure: '0',
            RedCold: '0',
            GreenCold: '0',
            BlueCold: '16',
            RedHot: '16',
            GreenHot: '0',
            BlueHot: '0',
            EnergyMode: '0',
        }]
    ]);
    return {
        choosenProfile: "default",
        profiles: profiles
    };
}

export function loadSettings(): Promise<ISettingsProfiles> {
    return new Promise((resolve) => {
        fs.readFile(settingsProfilesFileName, (error, data) => {
            if(error) {
                console.error('Could not load profiles. Default profile loaded. ' + error);
                resolve(getDefaultSettingsProfiles());
            } else {
                resolve(JSON.parse(data.toString()));
            }
        })
    });
}

export function serializeSettingsProfiles(profiles: ISettingsProfiles) {
    fs.writeFile(settingsProfilesFileName, JSON.stringify(profiles), (err) => {
        if(err) {
            console.error('Error while saving settings profiles: ' + err);
        }
    });
}