import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { refactorObjectName } from './refactor';

describe('refactorObjectName', () => {
    let document: vscode.TextDocument;
    let editor: vscode.TextEditor;

    beforeEach(async () => {
        document = await vscode.workspace.openTextDocument({
            content: 'class TestClass {}',
            language: 'csharp'
        });
        editor = await vscode.window.showTextDocument(document);
    });

    afterEach(async () => {
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });

    it('should rename the file when object name matches file name', async () => {
        const fileName = 'TestClass.cs';
        const newFileName = 'NewTestClass.cs';
        const filePath = path.join(vscode.workspace.rootPath || '', fileName);
        const newFilePath = path.join(vscode.workspace.rootPath || '', newFileName);

        fs.writeFileSync(filePath, document.getText());

        const selection = new vscode.Selection(0, 6, 0, 15);
        editor.selection = selection;

        await refactorObjectName();

        expect(fs.existsSync(newFilePath)).toBe(true);
        expect(fs.existsSync(filePath)).toBe(false);

        fs.unlinkSync(newFilePath);
    });

    it('should not rename the file when object name does not match file name', async () => {
        const fileName = 'DifferentClass.cs';
        const filePath = path.join(vscode.workspace.rootPath || '', fileName);

        fs.writeFileSync(filePath, document.getText());

        const selection = new vscode.Selection(0, 6, 0, 15);
        editor.selection = selection;

        await refactorObjectName();

        expect(fs.existsSync(filePath)).toBe(true);

        fs.unlinkSync(filePath);
    });
});
