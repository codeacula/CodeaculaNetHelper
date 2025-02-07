# Codeacula's .Net Helper

Codeacula's .Net Helper is a VS Code extension designed to assist in .Net Core development. It provides various features to streamline your development workflow, including refactoring, namespace updates, and automatic analyzer fixes.

## Features

- **Refactor Object Name**: When refactoring the name of an object using F2, if the previous name of the object matches the file name, it automatically changes the file name as well.
- **Update Namespace on File Move**: When dragging/dropping files in the explorer, it automatically updates the assigned namespace.
- **Update Namespace on Folder Rename**: When renaming a folder, it updates the namespaces of the containing classes.
- **Convert Namespace to File Scope**: Automatically converts the namespace to file scope if needed and places it at the top of the file.
- **Apply Analyzer Fixes on Save**: On file save, it automatically applies all available analyzer fixes that can be applied.

## Usage Instructions

1. **Refactor Object Name**:
   - Select the object name you want to refactor.
   - Press F2 to rename the object.
   - If the object name matches the file name, the file name will be automatically updated.

2. **Update Namespace on File Move**:
   - Drag and drop a file in the explorer.
   - The assigned namespace will be automatically updated.

3. **Update Namespace on Folder Rename**:
   - Rename a folder in the explorer.
   - The namespaces of the containing classes will be automatically updated.

4. **Convert Namespace to File Scope**:
   - Open a C# file.
   - The extension will automatically convert the namespace to file scope if needed and place it at the top of the file.

5. **Apply Analyzer Fixes on Save**:
   - Save a C# file.
   - The extension will automatically apply all available analyzer fixes.

## Permissions and User Preferences

- The extension will prompt the user for permissions when performing actions, except for format on save.
- Users can choose to not be prompted again for specific actions.
