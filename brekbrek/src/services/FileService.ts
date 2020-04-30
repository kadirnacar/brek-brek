import { ApplicationState } from '@store';
import * as path from 'path';
import * as RNFS from 'react-native-fs';

class FileServiceHelper {
    stateFile: string = path.join(RNFS.DocumentDirectoryPath, 'state.json');
    configFile: string = path.join(RNFS.DocumentDirectoryPath, 'config.json');

    public async readConfigFromFile(): Promise<any> {
        try {
            if (!RNFS.exists(this.stateFile)) {
                return {};
            }
            const content = await RNFS.readFile(this.configFile);
            const result = JSON.parse(content);
            return result;
        } catch (ex) {
            console.warn(ex)
            return {};
        }
    }

    public async saveConfigToFile(config): Promise<void> {
        try {
            await RNFS.writeFile(this.configFile, JSON.stringify(config));
        } catch{ }
    }

    public async readStateFromFile(): Promise<any> {
        try {
            if (!RNFS.exists(this.stateFile)) {
                return {};
            }
            const content = await RNFS.readFile(this.stateFile);
            const result: ApplicationState = JSON.parse(content);
            return result;
        } catch (ex) {
            console.warn(ex)
            return {};
        }
    }

    public async saveStateToFile(state: ApplicationState): Promise<void> {
        try {
            await RNFS.writeFile(this.stateFile, JSON.stringify(state));
        } catch{ }
    }
}

export const FileService = new FileServiceHelper();