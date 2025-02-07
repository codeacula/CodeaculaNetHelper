import * as vscode from 'vscode';
import { applyAnalyzerFixes, applyAnalyzerFixesOnSave } from './applyAnalyzerFixes';

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
        languages: {
            ...originalModule.languages,
            getDiagnostics: jest.fn(() => []),
        },
    };
});

describe('applyAnalyzerFixes', () => {
    it('should apply analyzer fixes', async () => {
        const mockEditor = {
            document: {
                uri: 'file:///test.cs',
                lineCount: 10,
            },
        };
        vscode.window.activeTextEditor = mockEditor as any;

        await applyAnalyzerFixes();

        expect(vscode.commands.executeCommand).toHaveBeenCalledWith('editor.action.quickFix', {
            uri: 'file:///test.cs',
            range: new vscode.Range(0, 0, 10, 0),
            code: undefined,
        });
    });

    it('should not apply analyzer fixes if no active editor', async () => {
        vscode.window.activeTextEditor = null;

        await applyAnalyzerFixes();

        expect(vscode.commands.executeCommand).not.toHaveBeenCalled();
    });
});

describe('applyAnalyzerFixesOnSave', () => {
    it('should apply analyzer fixes on save for C# files', async () => {
        const mockEvent = {
            document: {
                languageId: 'csharp',
            },
        };
        jest.spyOn(vscode.window, 'activeTextEditor', 'get').mockReturnValue({
            document: {
                uri: 'file:///test.cs',
                lineCount: 10,
            },
        } as any);

        await applyAnalyzerFixesOnSave(mockEvent as any);

        expect(vscode.commands.executeCommand).toHaveBeenCalledWith('editor.action.quickFix', {
            uri: 'file:///test.cs',
            range: new vscode.Range(0, 0, 10, 0),
            code: undefined,
        });
    });

    it('should not apply analyzer fixes on save for non-C# files', async () => {
        const mockEvent = {
            document: {
                languageId: 'javascript',
            },
        };

        await applyAnalyzerFixesOnSave(mockEvent as any);

        expect(vscode.commands.executeCommand).not.toHaveBeenCalled();
    });
});
