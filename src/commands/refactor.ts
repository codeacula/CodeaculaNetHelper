import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { promptUserForPermission } from '../utils/permissionHandler';

export async function refactorObjectName() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const selection = editor.selection;
    const selectedText = document.getText(selection);

    const fileName = path.basename(document.fileName, path.extname(document.fileName));
    if (selectedText === fileName) {
        const newFileName = await vscode.window.showInputBox({
            prompt: 'Enter new file name',
            value: fileName
        });

        if (newFileName && newFileName !== fileName) {
            const permissionGranted = await promptUserForPermission('rename the file');
            if (permissionGranted) {
                const newFilePath = path.join(path.dirname(document.fileName), newFileName + path.extname(document.fileName));
                fs.renameSync(document.fileName, newFilePath);
                const newUri = vscode.Uri.file(newFilePath);
                const newDocument = await vscode.workspace.openTextDocument(newUri);
                await vscode.window.showTextDocument(newDocument);
            }
        }
    }

    // Perform the refactoring logic here
    const refactorEdit = new vscode.WorkspaceEdit();
    refactorEdit.replace(document.uri, selection, selectedText);
    await vscode.workspace.applyEdit(refactorEdit);
    await document.save();
}
