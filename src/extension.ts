import * as vscode from 'vscode';
import { refactorObjectName } from './commands/refactor';
import { updateNamespaceOnFileMove, updateNamespaceOnFolderRename } from './commands/updateNamespace';
import { convertNamespaceToFileScope } from './commands/convertNamespace';
import { applyAnalyzerFixesOnSave } from './commands/applyAnalyzerFixes';
import { Preferences } from './preferences';
import { promptUserForPermission } from './utils/permissionHandler';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.refactorObjectName', refactorObjectName),
        vscode.commands.registerCommand('extension.updateNamespaceOnFileMove', updateNamespaceOnFileMove),
        vscode.commands.registerCommand('extension.updateNamespaceOnFolderRename', updateNamespaceOnFolderRename),
        vscode.commands.registerCommand('extension.convertNamespaceToFileScope', convertNamespaceToFileScope),
        vscode.workspace.onWillSaveTextDocument(applyAnalyzerFixesOnSave)
    );

    vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.isDirty) {
            showDiffForChanges(event.document);
        }
    });
}

export function deactivate() {}

async function showDiffForChanges(document: vscode.TextDocument) {
    const diff = await vscode.commands.executeCommand('vscode.diff', document.uri, document.uri);
    const userResponse = await vscode.window.showInformationMessage('Do you want to apply these changes?', 'Yes', 'No', 'Do not ask again');
    if (userResponse === 'Yes') {
        await document.save();
    } else if (userResponse === 'Do not ask again') {
        const preferences = Preferences.getInstance();
        await preferences.setPreference('showDiffForChanges', false);
    }
}
