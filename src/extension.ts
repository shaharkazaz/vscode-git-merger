'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { exec, execSync } from 'child_process';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.gitMergeFrom', () => {
        exec('git branch -a',{cwd: vscode.workspace.rootPath}, (error, stdout, stderr) => {
            if(error){
                vscode.window.showErrorMessage(error.toString());
                return;
            }
            let currentBranch,
            branchesNames = stdout.split("\n").filter((branch) => {
                if(branch.indexOf("*") != -1){
                    currentBranch = branch.replace('*','').trim();
                    return false;
                }
                return (branch.trim().length > 0 && branch.indexOf("*") == -1 && branch.indexOf("HEAD") == -1)
            });
            vscode.window.showQuickPick(branchesNames, "Chose destination branch").then(chosenitem => {
                if(chosenitem){
                    exec("git merge " + chosenitem + " --no-commit --no-ff", {cwd: vscode.workspace.rootPath}, (error, stdout, stderr) => {
                        if(stdout){
                            if(stdout.toLowerCase().indexOf("conflict") != -1){
                                let conflictedFiles = stdout.split("\n"),conflictedFilesLength = conflictedFiles.length -1;
                                console.log("Conflicts while mergning in the following files:");
                                for(let i = 0; i < conflictedFilesLength; i++){
                                    let conflictIndex = conflictedFiles[i].indexOf("CONFLICT (content): Merge conflict in");
                                    if(conflictIndex != -1){
                                        console.log(conflictedFiles[i].substr(38, conflictedFiles[i].length));
                                    }
                                }
                                vscode.window.showWarningMessage("Seems like there are some conflicts to handle (Conflicted files list in log)");
                                return;
                            }
                            else if(stdout.indexOf("up-to-date") != -1){
                                vscode.window.setStatusBarMessage("Already up-to-date", 3000);
                                return;
                            }
                        }
                        else if(error){
                            console.log("Error while mergning");
                            console.log(error);
                            vscode.window.showErrorMessage("Oops! something didn't work check the log for more inforamtion");
                            return;
                        }
                        vscode.window.setStatusBarMessage(chosenitem + " was merged into " + currentBranch, 3000);
                    });
                }
            });
        });
    });
    let disposable2 = vscode.commands.registerCommand('extension.gitAbortMerge', () => {
        // The code you place here will be executed every time your command is executed
        exec('git merge --abort',{cwd: vscode.workspace.rootPath}, (error, stdout, stderr) => {
            if(error){
                console.log("Error while mergning");
                console.log(stderr.replace("fatal:", ""));
                vscode.window.showErrorMessage("Oops! something didn't work check the log for more inforamtion");
                return;
            }
            vscode.window.setStatusBarMessage("Merge was successfully aborted", 3000);
        });
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {
}