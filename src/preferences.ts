import * as vscode from 'vscode';

export class Preferences {
    private static instance: Preferences;
    private preferences: { [key: string]: boolean } = {};

    private constructor() {
        this.loadPreferences();
    }

    public static getInstance(): Preferences {
        if (!Preferences.instance) {
            Preferences.instance = new Preferences();
        }
        return Preferences.instance;
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
}
