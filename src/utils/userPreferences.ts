import * as vscode from 'vscode';

export class UserPreferences {
    private static instance: UserPreferences;
    private preferences: { [key: string]: boolean } = {};

    private constructor() {
        this.loadPreferences();
    }

    public static getInstance(): UserPreferences {
        if (!UserPreferences.instance) {
            UserPreferences.instance = new UserPreferences();
        }
        return UserPreferences.instance;
    }

    public getPreference(key: string): boolean {
        return this.preferences[key] || false;
    }

    public async setPreference(key: string, value: boolean): Promise<void> {
        this.preferences[key] = value;
        await this.savePreferences();
    }

    private async loadPreferences(): Promise<void> {
        const config = vscode.workspace.getConfiguration('codeaculasDotnetHelper');
        this.preferences = config.get<{ [key: string]: boolean }>('preferences', {});
    }

    private async savePreferences(): Promise<void> {
        const config = vscode.workspace.getConfiguration('codeaculasDotnetHelper');
        await config.update('preferences', this.preferences, vscode.ConfigurationTarget.Global);
    }

    public async promptUserForPermission(action: string): Promise<boolean> {
        const preferenceKey = `permission_${action.replace(/\s+/g, '_').toLowerCase()}`;
        const userPreference = this.getPreference(preferenceKey);

        if (userPreference) {
            return true;
        }

        const userResponse = await vscode.window.showInformationMessage(`Do you want to ${action}?`, 'Yes', 'No', 'Do not ask again');
        if (userResponse === 'Yes') {
            return true;
        } else if (userResponse === 'Do not ask again') {
            await this.setPreference(preferenceKey, true);
            return true;
        }
        return false;
    }
}
