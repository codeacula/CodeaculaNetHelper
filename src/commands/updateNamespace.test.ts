import * as vscode from 'vscode';
import { updateNamespaceOnFileMove, updateNamespaceOnFolderRename } from './updateNamespace';

jest.mock('vscode', () => {
    const originalModule = jest.requireActual('vscode');
    return {
        ...originalModule,
        window: {
            ...originalModule.window,
            showInformationMessage: jest.fn(() => Promise.resolve('Yes')),
        },
        commands: {
            ...originalModule.commands,
            executeCommand: jest.fn(() => Promise.resolve()),
        },
    };
});

describe('updateNamespaceOnFileMove', () => {
    it('should update namespace on file move', async () => {
        const oldUri = vscode.Uri.file('/old/path/test.cs');
        const newUri = vscode.Uri.file('/new/path/test.cs');

        await updateNamespaceOnFileMove(oldUri, newUri);

        expect(vscode.commands.executeCommand).toHaveBeenCalledWith('vscode.diff', newUri, newUri);
        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Do you want to update the namespace?', 'Yes', 'No', 'Do not ask again');
    });

    it('should not update namespace if user denies permission', async () => {
        (vscode.window.showInformationMessage as jest.Mock).mockResolvedValueOnce('No');
        const oldUri = vscode.Uri.file('/old/path/test.cs');
        const newUri = vscode.Uri.file('/new/path/test.cs');

        await updateNamespaceOnFileMove(oldUri, newUri);

        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Do you want to update the namespace?', 'Yes', 'No', 'Do not ask again');
        expect(vscode.commands.executeCommand).not.toHaveBeenCalled();
    });
});

describe('updateNamespaceOnFolderRename', () => {
    it('should update namespaces on folder rename', async () => {
        const oldUri = vscode.Uri.file('/old/path');
        const newUri = vscode.Uri.file('/new/path');

        await updateNamespaceOnFolderRename(oldUri, newUri);

        expect(vscode.commands.executeCommand).toHaveBeenCalledWith('vscode.diff', newUri, newUri);
        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Do you want to update the namespaces of the containing classes?', 'Yes', 'No', 'Do not ask again');
    });

    it('should not update namespaces if user denies permission', async () => {
        (vscode.window.showInformationMessage as jest.Mock).mockResolvedValueOnce('No');
        const oldUri = vscode.Uri.file('/old/path');
        const newUri = vscode.Uri.file('/new/path');

        await updateNamespaceOnFolderRename(oldUri, newUri);

        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Do you want to update the namespaces of the containing classes?', 'Yes', 'No', 'Do not ask again');
        expect(vscode.commands.executeCommand).not.toHaveBeenCalled();
    });
});
