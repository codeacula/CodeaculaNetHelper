import * as vscode from 'vscode';
import { Preferences } from '../preferences';
import { promptUserForPermission } from '../utils/permissionHandler';

export async function applyAnalyzerFixes() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const diagnostics = vscode.languages.getDiagnostics(document.uri);

    const fixes = diagnostics
        .filter(diagnostic => diagnostic.source === 'csharp')
        .map(diagnostic => diagnostic.code)
        .filter((value, index, self) => self.indexOf(value) === index);

    for (const fix of fixes) {
        await vscode.commands.executeCommand('editor.action.quickFix', {
            uri: document.uri,
            range: new vscode.Range(0, 0, document.lineCount, 0),
            code: fix
        });
    }
}

export async function applyAnalyzerFixesOnSave(event: vscode.TextDocumentWillSaveEvent) {
    if (event.document.languageId !== 'csharp') {
        return;
    }

    await applyAnalyzerFixes();
}

async function showDiffForFixes(document: vscode.TextDocument) {
    const diff = await vscode.commands.executeCommand('vscode.diff', document.uri, document.uri);
    const userResponse = await vscode.window.showInformationMessage('Do you want to apply these changes?', 'Yes', 'No', 'Do not ask again');
    if (userResponse === 'Yes') {
        await document.save();
    } else if (userResponse === 'Do not ask again') {
        const preferences = Preferences.getInstance();
        await preferences.setPreference('showDiffForFixes', false);
    }
}
