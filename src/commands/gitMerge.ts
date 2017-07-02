'use strict';

import * as vscode from 'vscode';
import {
    exec
} from 'child_process';
import * as logger from "../logger";
import strings from '../constants/string-constnats';
import {
    IBranchsObject
} from "../constants/interfaces";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.gitMergeFrom', () => {
        exec(strings.git.getBranches, {
            cwd: vscode.workspace.rootPath
        }, (error, stdout, stderr) => {
            if (error) {
                logger.logError(strings.error("fetching branch list"), stderr || error);
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
                    branchObject.currentBranch = branch.replace('*', '').trim().substring(0, columnIndex-1);
                } else if(branch.indexOf("HEAD") == -1) {
                    let branchName =  branch.substring(0, columnIndex),
                        branchHash = branch.substring(columnIndex + 1, branch.length);
                    if(branchName.indexOf("origin") != -1){
                        branchHash = "Remote branch at " + branchHash;
                    }
                    branchObject.branchList.push({label: branchName, description: branchHash})
                }
            }

            vscode.window.showQuickPick(branchObject.branchList, strings.quickPick.chooseBranch).then(chosenitem => {
                if (chosenitem) {
                    exec(strings.git.merge(["no-commit", "no-ff"], chosenitem.label), {
                        cwd: vscode.workspace.rootPath
                    }, (error, stdout, stderr) => {
                        if (stdout) {
                            if (stdout.toLowerCase().indexOf("conflict") != -1) {
                                let conflictedFiles = stdout.split("\n"),
                                    conflictedFilesLength = conflictedFiles.length - 1;
                                logger.logWarning(strings.warnings.conflicts);
                                for (let i = 0; i < conflictedFilesLength; i++) {
                                    let conflictIndex = conflictedFiles[i].indexOf(strings.git.conflicts);
                                    if (conflictIndex != -1) {
                                        logger.logWarning(conflictedFiles[i].substr(38, conflictedFiles[i].length));
                                    }
                                }
                                vscode.window.showWarningMessage(strings.windowConflictsMessage, strings.actionButtons.openLog).then((action) => {
                                    if(action == strings.actionButtons.openLog){logger.openLog();}
                                });
                                return;
                            } else if (stdout.indexOf(strings.git.upToDate) != -1) {
                                logger.logInfo(strings.git.upToDate);
                                return;
                            }
                        } else if (error) {
                            logger.logError(strings.error("merging"), stderr || error);
                            return;
                        }
                        logger.logInfo(strings.success.merge(chosenitem.label, branchObject.currentBranch));
                    });
                }
            });
        });
    });
    context.subscriptions.push(disposable);
}