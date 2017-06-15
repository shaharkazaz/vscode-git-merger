'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { exec, execSync } from 'child_process';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.gitMergeFrom', () => {
        // The code you place here will be executed every time your command is executed
        exec('git branch -a',{cwd: vscode.workspace.rootPath}, (error, stdout, stderr) => {
            if(error){
                vscode.window.showErrorMessage(error.toString());
                return;
            }
            let listOfBranches = stdout.split("\n").filter((branch) => {
                return (branch.trim().length > 0 && branch.indexOf("*") == -1)
            });
            vscode.window.showQuickPick(listOfBranches, "Chose destination branch").then(chosenitem => {
                if(chosenitem){
                    
                    exec("git merge " + chosenitem + "--no-commit --no-ff", {cwd: vscode.workspace.rootPath}, (error, stdout, stderr) => {
                        if(error){
                            vscode.window.showErrorMessage(error.toString());
                            return;
                        }
                    });
                }
            });
        });
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}