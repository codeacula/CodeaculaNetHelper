import * as vscode from 'vscode';
import { Preferences } from '../preferences';

export async function promptUserForPermission(action: string): Promise<boolean> {
    const preferences = Preferences.getInstance();
    const preferenceKey = `permission_${action.replace(/\s+/g, '_').toLowerCase()}`;
    const userPreference = preferences.getPreference(preferenceKey);

    if (userPreference) {
        return true;
    }

    const userResponse = await vscode.window.showInformationMessage(`Do you want to ${action}?`, 'Yes', 'No', 'Do not ask again');
    if (userResponse === 'Yes') {
        return true;
    } else if (userResponse === 'Do not ask again') {
        await preferences.setPreference(preferenceKey, true);
        return true;
    }
    return false;
}
