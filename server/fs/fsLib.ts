import fs from 'fs';
import { ISettingsProfiles, ISettingsState } from '../../src/types';
import { reject } from 'q';

function getDefaultSettingsProfiles(): ISettingsProfiles {
    var profiles: Map<string, ISettingsState> = new Map([
        [ "default", {
            Group1Temperature: '1000',
            Group1AutoMode1: '',
            Group1AutoMode2: '',
            Group2Temperature: '1000',
            Group2AutoMode1: '',
            Group2AutoMode2: '',
            SteamPressure: '1000',
            RedCold: '1',
            GreenCold: '1',
            BlueCold: '1',
            RedHot: '1',
            GreenHot: '1',
            BlueHot: '1',
            EnergyMode: '1'
        }]
    ]);
    return {
        choosenProfile: "default",
        profiles
    };
}

export function loadSettings(): Promise<ISettingsProfiles> {
    return new Promise((resolve, reject) => {
        fs.readFile("settingsProfiles.json", (error, data) => {
            if(error) {
                console.error('Could not load profiles');
                reject({});
            } else {

            }
            resolve(JSON.parse(data.toString()));
        })
    });
}