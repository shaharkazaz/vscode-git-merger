'use strict';

import * as vscode from 'vscode';
import {
    exec
} from 'child_process';
import * as logger from "../../logger";
import strings from '../../constants/string-constnats';
import {
    IBranchsObject
} from "../../constants/interfaces";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('gitMerger.mergeFrom', () => {
        exec(strings.git.getBranches, {
            cwd: vscode.workspace.rootPath
        }, (error, stdout, stderr) => {
            if (error) {
                logger.logError(strings.error("fetching branch list"), stderr || error);
                return;
            }
            let branchList = JSON.parse("[" + stdout.slice(0, -2) + "]"),
                currentBranch;
            branchList = branchList.filter((branch) => {
                if (branch.current === "*") {
                    currentBranch = branch.label;
                } else {
                    if (branch.label.indexOf("origin") != -1) {
                        branch.description = "Remote branch at " + branch.description;
                    }
                    return true;
                }
            });
            vscode.window.showQuickPick(branchList, {
                placeHolder: strings.quickPick.chooseBranch
            }).then(chosenitem => {
                if (chosenitem) {
                    exec(strings.git.merge(strings.userSettings.get("mergeCommandFlags"), chosenitem.label), {
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
                                    if (action == strings.actionButtons.openLog) {
                                        logger.openLog("errors");
                                    }
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
                        logger.logInfo(strings.success.merge(chosenitem.label, currentBranch));
                    });
                }
            });
        });
    });
    context.subscriptions.push(disposable);
}