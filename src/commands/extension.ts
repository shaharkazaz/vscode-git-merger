'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { exec, execSync } from 'child_process';
import * as logger from "../logger";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.gitMergeFrom', () => {
        exec('git branch -a',{cwd: vscode.workspace.rootPath}, (error, stdout, stderr) => {
            if(error){
                logger.logError("Error while fetching branches");
                logger.logError(stderr || error);
                vscode.window.showErrorMessage("Oops! something didn't work check the \'Git Merger Log\' for more inforamtion");
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
            vscode.window.showQuickPick(branchesNames, "Choose destination branch").then(chosenitem => {
                if(chosenitem){
                    exec("git merge " + chosenitem + " --no-commit --no-ff", {cwd: vscode.workspace.rootPath}, (error, stdout, stderr) => {
                        if(stdout){
                            if(stdout.toLowerCase().indexOf("conflict") != -1){
                                let conflictedFiles = stdout.split("\n"),conflictedFilesLength = conflictedFiles.length -1;
                                logger.logInfo("Conflicts while mergning in the following files:");
                                for(let i = 0; i < conflictedFilesLength; i++){
                                    let conflictIndex = conflictedFiles[i].indexOf("CONFLICT (content): Merge conflict in");
                                    if(conflictIndex != -1){
                                        logger.logInfo(conflictedFiles[i].substr(38, conflictedFiles[i].length));
                                    }
                                }
                                vscode.window.showWarningMessage("Seems like there are some conflicts to handle (Conflicted files list in \'Git Merger Log\')");
                                return;
                            }
                            else if(stdout.indexOf("up-to-date") != -1){
                                logger.logInfo("Already up-to-date");
                                vscode.window.showInformationMessage("Already up-to-date");
                                return;
                            }
                        }
                        else if(error){
                            logger.logError("Error while mergning");
                            logger.logError(stderr || error);
                            vscode.window.showErrorMessage("Oops! something didn't work check the \'Git Merger Log\' for more inforamtion");
                            return;
                        }
                        logger.logInfo(chosenitem + " was merged into " + currentBranch);
                        vscode.window.showInformationMessage(chosenitem + " was merged into " + currentBranch);
                    });
                }
            });
        });
    });
    let disposable2 = vscode.commands.registerCommand('extension.gitAbortMerge', () => {
        // The code you place here will be executed every time your command is executed
        exec('git merge --abort',{cwd: vscode.workspace.rootPath}, (error, stdout, stderr) => {
            if(error){
                logger.logError("Error while aborting mergning");
                logger.logError(stderr || error);
                vscode.window.showErrorMessage("Oops! something didn't work check the \'Git Merger Log\' for more inforamtion");
                return;
            }
            logger.logInfo("Merge was successfully aborted");
            vscode.window.showInformationMessage("Merge was successfully aborted");
        });
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {
}