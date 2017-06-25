'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {
    exec
} from 'child_process';
import * as logger from "../logger";
import strings from '../constants/string-constnats';
// import {getBranches} from "../services/branch-manager";
import {
    IBranchsObject
} from "../constants/interfaces";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.gitMergeFrom', () => {
        exec(strings.commands.git.getBranches, {
            cwd: vscode.workspace.rootPath
        }, (error, stdout, stderr) => {
            if (error) {
                logger.logError(strings.messages.log.error.getBranches);
                logger.logError(stderr || error);
                vscode.window.showErrorMessage(strings.messages.windowMessages.error, strings.messages.actionButtons.openLog).then((action) => {
                    if(action == strings.messages.actionButtons.openLog){logger.openLog();}
                });
                return;
            }
            let branchObject: IBranchsObject = {
                currentBranch: "",
                branchList: []
            };
            let tempArray = stdout.split("\n"), tempArrayLength = tempArray.length -1;
            for (let i = 0; i < tempArrayLength; i++) {
                let branch = tempArray[i].replace(/'/g, '').trim(), columnIndex = branch.indexOf(":");
                if (branch.indexOf("*") != -1) {
                    branchObject.currentBranch = branch.replace('*', '').trim().substring(0, columnIndex);
                } else if(branch.indexOf("HEAD") == -1) {
                    let branchName =  branch.substring(0, columnIndex),
                        branchHash = branch.substring(columnIndex + 1, branch.length);
                    if(branchName.indexOf("origin") != -1){
                        branchHash = "Remote branch at " + branchHash;
                    }
                    branchObject.branchList.push({label: branchName, description: branchHash})
                }
            }

            vscode.window.showQuickPick(branchObject.branchList, strings.messages.quickPick.chooseBranch).then(chosenitem => {
                if (chosenitem) {
                    exec(strings.commands.git.merge(["no-commit", "no-ff"], chosenitem.label), {
                        cwd: vscode.workspace.rootPath
                    }, (error, stdout, stderr) => {
                        if (stdout) {
                            if (stdout.toLowerCase().indexOf("conflict") != -1) {
                                let conflictedFiles = stdout.split("\n"),
                                    conflictedFilesLength = conflictedFiles.length - 1;
                                logger.logInfo(strings.messages.log.warnings.conflicts);
                                for (let i = 0; i < conflictedFilesLength; i++) {
                                    let conflictIndex = conflictedFiles[i].indexOf(strings.git.conflicts);
                                    if (conflictIndex != -1) {
                                        logger.logInfo(conflictedFiles[i].substr(38, conflictedFiles[i].length));
                                    }
                                }
                                vscode.window.showWarningMessage(strings.messages.windowMessages.warnings.conflicts, strings.messages.actionButtons.openLog).then((action) => {
                                    if(action == strings.messages.actionButtons.openLog){logger.openLog();}
                                });
                                return;
                            } else if (stdout.indexOf(strings.git.upToDate) != -1) {
                                logger.logInfo(strings.git.upToDate);
                                vscode.window.showInformationMessage(strings.git.upToDate);
                                return;
                            }
                        } else if (error) {
                            logger.logError(strings.messages.log.error.merging);
                            logger.logError(stderr || error);
                            vscode.window.showErrorMessage(strings.messages.windowMessages.error, strings.messages.actionButtons.openLog).then((action) => {
                                if(action == strings.messages.actionButtons.openLog){logger.openLog();}
                            });
                            return;
                        }
                        logger.logInfo(strings.messages.common.success.merge(chosenitem, branchObject.currentBranch));
                        vscode.window.showInformationMessage(strings.messages.common.success.merge(chosenitem, branchObject.currentBranch));
                    });
                }
            });
        });
    });
    context.subscriptions.push(disposable);
}