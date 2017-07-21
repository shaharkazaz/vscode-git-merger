'use strict';

import * as vscode from 'vscode';
import strings from '../../constants/string-constnats';
import {
    exec
} from 'child_process';
import * as logger from "../../logger";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('gitMerger.unstash', () => {
        exec(strings.git.stash("list ", true), {
            cwd: vscode.workspace.rootPath
        }, (error, stdout, stderr) => {
            if (error) {
                logger.logError(strings.error("fetching stash list"), stderr || error);
                return;
            }
            if (stdout.length == 0) {
                logger.logInfo("No stash exists");
                return;
            }
            let stashList: Array < any > = JSON.parse("[" + stdout.slice(0, -1) + "]");
            stashList.forEach(stashItem => {
                stashItem.label = stashItem.label.replace("WIP ", "");
                stashItem.label = stashItem.label.charAt(0).toUpperCase() + stashItem.label.slice(1);
            });
            vscode.window.showQuickPick(stashList, {
                matchOnDescription: true,
                placeHolder: "Choose stash to apply"
            }).then(chosenitem => {
                if (chosenitem) {
                    exec(strings.git.stash("apply " + chosenitem.index), {
                        cwd: vscode.workspace.rootPath
                    }, (error, stdout, stderr) => {
                        if (error) {
                            logger.logError(strings.error("unstashing:"), stderr || error);
                            return;
                        }
                        logger.logInfo(strings.success.general("Stash", "applied on current branch"), {
                            name: "delete stash",
                            callback: () => {
                                exec(strings.git.stash("drop " + chosenitem.index), {
                                    cwd: vscode.workspace.rootPath
                                }, (error, stdout, stderr) => {
                                    if (error) {
                                        logger.logError(strings.error("droping stash:"), stderr || error);
                                        return;
                                    }
                                    if (stdout.indexOf("Dropped") != -1) {
                                        logger.logInfo(strings.success.general("Stash", "removed"));
                                    }
                                });
                            }
                        });
                    });
                }
            });
        });
    });

    context.subscriptions.push(disposable);
}