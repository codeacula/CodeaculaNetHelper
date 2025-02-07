import * as vscode from 'vscode';

export async function convertNamespaceToFileScope() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const text = document.getText();
    const namespaceMatch = text.match(/namespace\s+[\w\.]+/);

    if (namespaceMatch) {
        const permissionGranted = await promptUserForPermission('convert the namespace to file scope');
        if (!permissionGranted) {
            return;
        }

        const namespace = namespaceMatch[0];
        const updatedText = text.replace(namespace, '').trim();
        const newText = `${namespace}\n\n${updatedText}`;

        const edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), newText);
        await vscode.workspace.applyEdit(edit);
        await document.save();
    }
}

async function promptUserForPermission(action: string): Promise<boolean> {
    const userResponse = await vscode.window.showInformationMessage(`Do you want to ${action}?`, 'Yes', 'No', 'Do not ask again');
    if (userResponse === 'Yes') {
        return true;
    } else if (userResponse === 'Do not ask again') {
        // Store user preference to not ask again
        return true;
    }
    return false;
}
