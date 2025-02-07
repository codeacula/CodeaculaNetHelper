import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { promptUserForPermission } from '../utils/permissionHandler';

export async function updateNamespaceOnFileMove(oldUri: vscode.Uri, newUri: vscode.Uri) {
    const permissionGranted = await promptUserForPermission('update the namespace');
    if (!permissionGranted) {
        return;
    }

    const oldNamespace = getNamespaceFromUri(oldUri);
    const newNamespace = getNamespaceFromUri(newUri);

    const document = await vscode.workspace.openTextDocument(newUri);
    const text = document.getText();
    const updatedText = text.replace(new RegExp(`namespace ${oldNamespace}`, 'g'), `namespace ${newNamespace}`);

    const edit = new vscode.WorkspaceEdit();
    edit.replace(newUri, new vscode.Range(0, 0, document.lineCount, 0), updatedText);
    await vscode.workspace.applyEdit(edit);
    await document.save();
}

export async function updateNamespaceOnFolderRename(oldUri: vscode.Uri, newUri: vscode.Uri) {
    const permissionGranted = await promptUserForPermission('update the namespaces of the containing classes');
    if (!permissionGranted) {
        return;
    }

    const oldNamespace = getNamespaceFromUri(oldUri);
    const newNamespace = getNamespaceFromUri(newUri);

    const files = await vscode.workspace.findFiles(new vscode.RelativePattern(newUri.fsPath, '**/*.cs'));
    for (const file of files) {
        const document = await vscode.workspace.openTextDocument(file);
        const text = document.getText();
        const updatedText = text.replace(new RegExp(`namespace ${oldNamespace}`, 'g'), `namespace ${newNamespace}`);

        const edit = new vscode.WorkspaceEdit();
        edit.replace(file, new vscode.Range(0, 0, document.lineCount, 0), updatedText);
        await vscode.workspace.applyEdit(edit);
        await document.save();
    }
}

function getNamespaceFromUri(uri: vscode.Uri): string {
    const parts = uri.fsPath.split(path.sep);
    const namespaceParts = parts.slice(parts.indexOf('src') + 1, parts.length - 1);
    return namespaceParts.join('.');
}
