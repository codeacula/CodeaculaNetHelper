import * as vscode from 'vscode';
import { convertNamespaceToFileScope } from './convertNamespace';

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

describe('convertNamespaceToFileScope', () => {
    it('should convert namespace to file scope', async () => {
        const mockEditor = {
            document: {
                uri: 'file:///test.cs',
                getText: jest.fn(() => 'namespace TestNamespace { }'),
                lineCount: 1,
            },
        };
        vscode.window.activeTextEditor = mockEditor as any;

        await convertNamespaceToFileScope();

        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Do you want to convert the namespace to file scope?', 'Yes', 'No', 'Do not ask again');
        expect(vscode.commands.executeCommand).toHaveBeenCalledWith('vscode.diff', 'file:///test.cs', 'file:///test.cs');
    });

    it('should not convert namespace if no active editor', async () => {
        vscode.window.activeTextEditor = null;

        await convertNamespaceToFileScope();

        expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
    });

    it('should not convert namespace if user denies permission', async () => {
        (vscode.window.showInformationMessage as jest.Mock).mockResolvedValueOnce('No');
        const mockEditor = {
            document: {
                uri: 'file:///test.cs',
                getText: jest.fn(() => 'namespace TestNamespace { }'),
                lineCount: 1,
            },
        };
        vscode.window.activeTextEditor = mockEditor as any;

        await convertNamespaceToFileScope();

        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Do you want to convert the namespace to file scope?', 'Yes', 'No', 'Do not ask again');
        expect(vscode.commands.executeCommand).not.toHaveBeenCalled();
    });
});
